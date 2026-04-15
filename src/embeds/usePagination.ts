import type {
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from 'discord.js'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js'
import { PAGINATION_COLLECTION_TIME, PaginationButtonNames } from '../constants'
import L from '../i18n/i18n-node'
import type { Locales } from '../i18n/i18n-types'
import logger from '../utils/logger'

export const createPaginationButtons = ({
  canGoLeft,
  canGoRight,
}: {
  canGoLeft: boolean
  canGoRight: boolean
}) =>
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(PaginationButtonNames.LEFT)
      .setLabel('◀')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!canGoLeft),
    new ButtonBuilder()
      .setCustomId(PaginationButtonNames.RIGHT)
      .setLabel('▶')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!canGoRight)
  )

export interface RemotePaginationPage {
  embed: EmbedBuilder
  hasNextPage: boolean
  nextCursor: string | null
}

export const loadNextRemotePaginationPage = async ({
  remotePages,
  activePageIndex,
  loadPage,
}: {
  remotePages: RemotePaginationPage[]
  activePageIndex: number
  loadPage: (cursor: string) => Promise<RemotePaginationPage>
}) => {
  const currentPage = remotePages[activePageIndex]

  if (!currentPage.hasNextPage || !currentPage.nextCursor) {
    return {
      remotePages,
      activePageIndex,
      loaded: false,
    }
  }

  const nextPage = await loadPage(currentPage.nextCursor)
  remotePages.push(nextPage)

  return {
    remotePages,
    activePageIndex: activePageIndex + 1,
    loaded: true,
  }
}

interface StaticUsePaginationProps {
  embeds: EmbedBuilder[]
}

interface RemoteUsePaginationProps {
  initialPage: RemotePaginationPage
  loadPage: (cursor: string) => Promise<RemotePaginationPage>
}

interface BaseUsePaginationProps {
  interaction: ChatInputCommandInteraction<CacheType>
  locale: Locales
  time?: number
}

type PaginationModeProps = StaticUsePaginationProps | RemoteUsePaginationProps

type UsePaginationProps = BaseUsePaginationProps & PaginationModeProps

interface PaginationSession {
  getCurrentEmbed: () => EmbedBuilder
  isOnlyOnePage: () => boolean
  canGoLeft: () => boolean
  canGoRight: () => boolean
  moveLeft: () => boolean
  moveRight: (buttonInteraction: ButtonInteraction) => Promise<boolean>
}

const isRemotePaginationProps = (props: PaginationModeProps): props is RemoteUsePaginationProps =>
  'initialPage' in props

const createStaticPaginationSession = ({ embeds }: StaticUsePaginationProps): PaginationSession => {
  let activePageIndex = 0

  return {
    getCurrentEmbed: () => embeds[activePageIndex],
    isOnlyOnePage: () => embeds.length === 1,
    canGoLeft: () => activePageIndex > 0,
    canGoRight: () => activePageIndex < embeds.length - 1,
    moveLeft: () => {
      if (activePageIndex === 0) {
        return false
      }

      activePageIndex -= 1
      return true
    },
    moveRight: () => {
      if (activePageIndex >= embeds.length - 1) {
        return Promise.resolve(false)
      }

      activePageIndex += 1
      return Promise.resolve(true)
    },
  }
}

const createRemotePaginationSession = ({
  initialPage,
  loadPage,
}: RemoteUsePaginationProps): PaginationSession => {
  const remotePages = [initialPage]
  let activePageIndex = 0
  let isLoadingNextPage = false

  return {
    getCurrentEmbed: () => remotePages[activePageIndex].embed,
    isOnlyOnePage: () => !remotePages[0].hasNextPage,
    canGoLeft: () => activePageIndex > 0,
    canGoRight: () => {
      const currentPage = remotePages[activePageIndex]
      return activePageIndex < remotePages.length - 1 || currentPage.hasNextPage
    },
    moveLeft: () => {
      if (activePageIndex === 0) {
        return false
      }

      activePageIndex -= 1
      return true
    },
    moveRight: async (buttonInteraction) => {
      if (activePageIndex < remotePages.length - 1) {
        activePageIndex += 1
        return true
      }

      const currentPage = remotePages[activePageIndex]
      if (!currentPage.hasNextPage || !currentPage.nextCursor) {
        return false
      }

      await buttonInteraction.deferUpdate()
      if (isLoadingNextPage) {
        return false
      }

      isLoadingNextPage = true
      try {
        const nextPageState = await loadNextRemotePaginationPage({
          remotePages,
          activePageIndex,
          loadPage,
        })
        activePageIndex = nextPageState.activePageIndex
        return nextPageState.loaded
      } finally {
        isLoadingNextPage = false
      }
    },
  }
}

const createPaginationSession = (props: PaginationModeProps): PaginationSession =>
  isRemotePaginationProps(props)
    ? createRemotePaginationSession(props)
    : createStaticPaginationSession(props)

const getPaginationComponents = (session: PaginationSession) => {
  if (session.isOnlyOnePage()) {
    return undefined
  }

  return [
    createPaginationButtons({
      canGoLeft: session.canGoLeft(),
      canGoRight: session.canGoRight(),
    }),
  ]
}

const updatePaginationMessage = async ({
  interaction,
  session,
}: {
  interaction: ChatInputCommandInteraction<CacheType>
  session: PaginationSession
}) => {
  await interaction.editReply({
    embeds: [session.getCurrentEmbed()],
    components: getPaginationComponents(session) ?? [],
  })
}

const handlePaginationButton = async ({
  buttonInteraction,
  interaction,
  locale,
  session,
}: {
  buttonInteraction: ButtonInteraction
  interaction: ChatInputCommandInteraction<CacheType>
  locale: Locales
  session: PaginationSession
}) => {
  if (buttonInteraction.user.id !== interaction.user.id) {
    await buttonInteraction.reply({
      content: L[locale].error.buttonsDisabled(),
      ephemeral: true,
    })
    return
  }

  if (buttonInteraction.customId === PaginationButtonNames.LEFT) {
    if (!session.moveLeft()) {
      await buttonInteraction.update({
        embeds: [session.getCurrentEmbed()],
        components: getPaginationComponents(session),
      })
      return
    }

    await buttonInteraction.update({
      embeds: [session.getCurrentEmbed()],
      components: getPaginationComponents(session),
    })
    return
  }

  if (buttonInteraction.customId !== PaginationButtonNames.RIGHT) {
    return
  }

  const hasMoved = await session.moveRight(buttonInteraction)
  if (buttonInteraction.deferred) {
    if (hasMoved) {
      await updatePaginationMessage({
        interaction,
        session,
      })
    }
    return
  }

  await buttonInteraction.update({
    embeds: [session.getCurrentEmbed()],
    components: getPaginationComponents(session),
  })
}

export const usePagination = async ({
  interaction,
  locale,
  time = PAGINATION_COLLECTION_TIME,
  ...props
}: UsePaginationProps) => {
  const session = createPaginationSession(props as PaginationModeProps)
  const reply = await interaction.editReply({
    embeds: [session.getCurrentEmbed()],
    components: getPaginationComponents(session),
  })

  if (session.isOnlyOnePage()) {
    return
  }

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time,
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  collector.on('collect', async (buttonInteraction) => {
    try {
      await handlePaginationButton({
        buttonInteraction,
        interaction,
        locale,
        session,
      })
    } catch (error) {
      logger.error(error, 'Error while collecting pagination buttons')
    }
  })

  // removes buttons when done collecting
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  collector.on('end', async () => {
    try {
      await interaction.editReply({
        embeds: [session.getCurrentEmbed()],
        components: [],
      })
    } catch (error) {
      logger.warn(error, 'Error while removing pagination buttons')
    }
  })
}
