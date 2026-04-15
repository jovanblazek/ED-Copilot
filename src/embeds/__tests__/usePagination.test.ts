import { EmbedBuilder } from 'discord.js'
import { loadNextRemotePaginationPage, type RemotePaginationPage } from '../usePagination'

describe('loadNextRemotePaginationPage', () => {
  const createPage = (label: string, hasNextPage: boolean, nextCursor: string | null) =>
    ({
      embed: new EmbedBuilder().setTitle(label),
      hasNextPage,
      nextCursor,
    }) satisfies RemotePaginationPage

  it('loads and caches the next page', async () => {
    const remotePages = [createPage('page-1', true, 'cursor-2')]
    const loadPage = jest.fn().mockResolvedValue(createPage('page-2', false, null))

    const result = await loadNextRemotePaginationPage({
      remotePages,
      activePageIndex: 0,
      loadPage,
    })

    expect(loadPage).toHaveBeenCalledWith('cursor-2')
    expect(result.loaded).toBe(true)
    expect(result.activePageIndex).toBe(1)
    expect(remotePages).toHaveLength(2)
    expect(remotePages[1].embed.toJSON().title).toBe('page-2')
  })

  it('does not fetch when there is no next cursor', async () => {
    const remotePages = [createPage('page-1', false, null)]
    const loadPage = jest.fn()

    const result = await loadNextRemotePaginationPage({
      remotePages,
      activePageIndex: 0,
      loadPage,
    })

    expect(loadPage).not.toHaveBeenCalled()
    expect(result.loaded).toBe(false)
    expect(result.activePageIndex).toBe(0)
    expect(remotePages).toHaveLength(1)
  })

  it('keeps previously cached pages when loading later pages', async () => {
    const remotePages = [
      createPage('page-1', true, 'cursor-2'),
      createPage('page-2', true, 'cursor-3'),
    ]
    const loadPage = jest.fn().mockResolvedValue(createPage('page-3', false, null))

    const result = await loadNextRemotePaginationPage({
      remotePages,
      activePageIndex: 1,
      loadPage,
    })

    expect(loadPage).toHaveBeenCalledWith('cursor-3')
    expect(result.activePageIndex).toBe(2)
    expect(remotePages.map((page) => page.embed.toJSON().title)).toEqual([
      'page-1',
      'page-2',
      'page-3',
    ])
  })
})
