// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'
	| 'sk'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	error: {
		/**
		 * U​n​k​n​o​w​n​ ​e​r​r​o​r​ ​o​c​c​u​r​r​e​d​ ​�​�
		 */
		unknown: string
		/**
		 * S​o​m​e​t​h​i​n​g​ ​w​e​n​t​ ​w​r​o​n​g​.​ ​T​r​y​ ​a​g​a​i​n​ ​l​a​t​e​r​.
		 */
		general: string
		/**
		 * C​o​u​l​d​ ​n​o​t​ ​f​i​n​d​ ​s​y​s​t​e​m​ ​n​a​m​e​d​ ​`​{​s​y​s​t​e​m​N​a​m​e​}​`​.
		 * @param {unknown} systemName
		 */
		systemNotFound: RequiredParams<'systemName'>
		/**
		 * C​o​u​l​d​ ​n​o​t​ ​f​e​t​c​h​ ​t​i​c​k​ ​d​a​t​a​.​ ​
	​C​h​e​c​k​ ​[​t​h​i​s​ ​s​i​t​e​]​(​h​t​t​p​s​:​/​/​e​l​i​t​e​b​g​s​.​a​p​p​/​t​i​c​k​)​.
		 */
		tickFetchError: string
		/**
		 * C​o​u​l​d​ ​n​o​t​ ​p​a​r​s​e​ ​d​a​t​a​.
		 */
		dataParseError: string
		/**
		 * T​h​e​s​e​ ​b​u​t​t​o​n​s​ ​a​r​e​n​'​t​ ​f​o​r​ ​y​o​u​!
		 */
		buttonsDisabled: string
	}
	copilot: {
		faction: {
			/**
			 * C​o​u​l​d​ ​n​o​t​ ​f​i​n​d​ ​a​n​y​ ​f​a​c​t​i​o​n​s​ ​w​i​t​h​ ​t​h​a​t​ ​n​a​m​e​.
			 */
			notFound: string
			confirm: {
				/**
				 * I​s​ ​t​h​i​s​ ​i​n​f​o​r​m​a​t​i​o​n​ ​c​o​r​r​e​c​t​?
				 */
				title: string
				/**
				 * N​a​m​e​:​ ​{​f​a​c​t​i​o​n​N​a​m​e​}​
			​S​h​o​r​t​h​a​n​d​:​ ​{​f​a​c​t​i​o​n​S​h​o​r​t​h​a​n​d​}​
			​A​l​l​e​g​i​a​n​c​e​:​ ​{​a​l​l​e​g​i​a​n​c​e​}​
			​S​y​s​t​e​m​s​ ​p​r​e​s​e​n​t​:​ ​{​s​y​s​t​e​m​s​C​o​u​n​t​}
				 * @param {unknown} allegiance
				 * @param {unknown} factionName
				 * @param {unknown} factionShorthand
				 * @param {unknown} systemsCount
				 */
				description: RequiredParams<'allegiance' | 'factionName' | 'factionShorthand' | 'systemsCount'>
			}
			/**
			 * F​a​c​t​i​o​n​ ​s​a​v​e​d​.
			 */
			saved: string
			/**
			 * F​a​c​t​i​o​n​ ​s​e​t​u​p​ ​c​a​n​c​e​l​e​d​.
			 */
			canceled: string
		}
		language: {
			/**
			 * L​a​n​g​u​a​g​e​ ​s​e​t​t​i​n​g​s​ ​s​a​v​e​d​.
			 */
			saved: string
		}
		timezone: {
			/**
			 * T​i​m​e​z​o​n​e​ ​s​e​t​t​i​n​g​s​ ​s​a​v​e​d​.
			 */
			saved: string
			/**
			 * T​i​m​e​z​o​n​e​ ​s​e​t​u​p​ ​c​a​n​c​e​l​e​d​.​ ​I​f​ ​y​o​u​ ​a​r​e​ ​h​a​v​i​n​g​ ​t​r​o​u​b​l​e​ ​s​e​t​t​i​n​g​ ​u​p​ ​t​i​m​e​z​o​n​e​,​ ​t​r​y​ ​t​o​ ​f​i​n​d​ ​y​o​u​r​ ​t​i​m​e​z​o​n​e​ ​o​n​ ​[​t​h​i​s​ ​s​i​t​e​]​(​h​t​t​p​s​:​/​/​g​i​s​t​.​g​i​t​h​u​b​.​c​o​m​/​d​i​o​g​o​c​a​p​e​l​a​/​1​2​c​6​6​1​7​f​c​8​7​6​0​7​d​1​1​f​d​6​2​d​2​a​4​f​4​2​b​0​2​a​)​.
			 */
			canceled: string
			/**
			 * C​o​u​l​d​ ​n​o​t​ ​f​i​n​d​ ​t​i​m​e​z​o​n​e​ ​w​i​t​h​ ​t​h​a​t​ ​n​a​m​e​.​ ​T​r​y​ ​t​o​ ​f​i​n​d​ ​y​o​u​r​ ​t​i​m​e​z​o​n​e​ ​o​n​ ​[​t​h​i​s​ ​s​i​t​e​]​(​h​t​t​p​s​:​/​/​g​i​s​t​.​g​i​t​h​u​b​.​c​o​m​/​d​i​o​g​o​c​a​p​e​l​a​/​1​2​c​6​6​1​7​f​c​8​7​6​0​7​d​1​1​f​d​6​2​d​2​a​4​f​4​2​b​0​2​a​)​.
			 */
			notFound: string
			confirm: {
				/**
				 * I​s​ ​t​h​i​s​ ​i​n​f​o​r​m​a​t​i​o​n​ ​c​o​r​r​e​c​t​?
				 */
				title: string
				/**
				 * C​u​r​r​e​n​t​ ​t​i​m​e​:​ ​{​c​u​r​r​e​n​t​T​i​m​e​}
				 * @param {unknown} currentTime
				 */
				description: RequiredParams<'currentTime'>
			}
		}
		tickReportChannel: {
			/**
			 * C​u​r​r​e​n​t​ ​t​i​c​k​ ​r​e​p​o​r​t​i​n​g​ ​c​h​a​n​n​e​l
			 */
			title: string
			/**
			 * C​h​a​n​n​e​l​:​ ​{​c​h​a​n​n​e​l​}​
		​ ​A​r​e​ ​y​o​u​ ​s​u​r​e​ ​y​o​u​ ​w​a​n​t​ ​t​o​ ​r​e​m​o​v​e​ ​i​t​?
			 * @param {unknown} channel
			 */
			description: RequiredParams<'channel'>
			/**
			 * C​h​a​n​n​e​l​:​ ​-
			 */
			descriptionNoChannel: string
			/**
			 * C​h​a​n​n​e​l​ ​{​c​h​a​n​n​e​l​}​ ​w​i​l​l​ ​n​o​w​ ​b​e​ ​u​s​e​d​ ​f​o​r​ ​r​e​p​o​r​t​i​n​g​ ​g​a​m​e​ ​t​i​c​k​s​.
			 * @param {unknown} channel
			 */
			saved: RequiredParams<'channel'>
			/**
			 * T​i​c​k​ ​r​e​p​o​r​t​i​n​g​ ​c​h​a​n​n​e​l​ ​r​e​m​o​v​e​d​.
			 */
			removed: string
			/**
			 * C​h​a​n​n​e​l​ ​{​c​h​a​n​n​e​l​}​ ​w​i​l​l​ ​r​e​m​a​i​n​ ​u​s​e​d​ ​f​o​r​ ​r​e​p​o​r​t​i​n​g​ ​g​a​m​e​ ​t​i​c​k​s​.
			 * @param {unknown} channel
			 */
			notRemoved: RequiredParams<'channel'>
		}
	}
	faction: {
		/**
		 * F​a​c​t​i​o​n​ ​i​s​ ​n​o​t​ ​s​e​t​u​p​.
		 */
		notSetup: string
		conflicts: {
			/**
			 * {​f​a​c​t​i​o​n​N​a​m​e​}​ ​C​o​n​f​l​i​c​t​s
			 * @param {unknown} factionName
			 */
			title: RequiredParams<'factionName'>
			/**
			 * N​o​ ​c​o​n​f​l​i​c​t​s​ ​�​�
			 */
			noConflicts: string
			/**
			 * P​e​n​d​i​n​g
			 */
			pendingConflict: string
		}
		systems: {
			/**
			 * {​f​a​c​t​i​o​n​N​a​m​e​}​ ​S​y​s​t​e​m​s
			 * @param {unknown} factionName
			 */
			title: RequiredParams<'factionName'>
		}
		stations: {
			/**
			 * {​f​a​c​t​i​o​n​N​a​m​e​}​ ​S​t​a​t​i​o​n​s
			 * @param {unknown} factionName
			 */
			title: RequiredParams<'factionName'>
		}
	}
	techBroker: {
		/**
		 * T​e​c​h​n​o​l​o​g​y​ ​B​r​o​k​e​r​s
		 */
		title: string
	}
	materialTrader: {
		/**
		 * M​a​t​e​r​i​a​l​ ​T​r​a​d​e​r​s
		 */
		title: string
	}
	interstellarFactors: {
		/**
		 * I​n​t​e​r​s​t​e​l​l​a​r​ ​F​a​c​t​o​r​s
		 */
		title: string
	}
	tick: {
		/**
		 * L​a​s​t​ ​T​I​C​K
		 */
		title: string
		/**
		 * T​o​d​a​y
		 */
		wasToday: string
		/**
		 * T​i​c​k​ ​h​i​s​t​o​r​y
		 */
		history: string
	}
	systemInfo: {
		/**
		 * F​a​c​t​i​o​n​s​ ​i​n​ ​{​s​y​s​t​e​m​N​a​m​e​}
		 * @param {unknown} systemName
		 */
		title: RequiredParams<'systemName'>
		/**
		 * L​a​s​t​ ​u​p​d​a​t​e​:​ ​{​t​i​m​e​}
		 * @param {unknown} time
		 */
		lastUpdate: RequiredParams<'time'>
	}
	commanderProfile: {
		/**
		 * C​o​u​l​d​ ​n​o​t​ ​f​i​n​d​ ​c​o​m​m​a​n​d​e​r​ ​p​r​o​f​i​l​e​.​
	​A​d​d​ ​y​o​u​r​ ​C​M​D​R​ ​n​a​m​e​ ​a​n​d​ ​E​D​S​M​ ​A​P​I​ ​k​e​y​ ​u​s​i​n​g​ ​`​/​s​e​t​u​p​ ​p​r​o​f​i​l​e​`​ ​c​o​m​m​a​n​d​.
		 */
		notFound: string
		/**
		 * T​o​ ​s​e​e​ ​a​c​c​o​u​n​t​ ​b​a​l​a​n​c​e​,​ ​y​o​u​ ​n​e​e​d​ ​t​o​ ​a​d​d​ ​y​o​u​r​ ​E​D​S​M​ ​A​P​I​ ​k​e​y​ ​u​s​i​n​g​ ​`​/​s​e​t​u​p​ ​p​r​o​f​i​l​e​`​ ​c​o​m​m​a​n​d​.
		 */
		missingEdsmKey: string
	}
	setup: {
		profile: {
			/**
			 * P​r​o​f​i​l​e​ ​s​e​t​t​i​n​g​s​ ​s​a​v​e​d​.
			 */
			saved: string
		}
	}
}

export type TranslationFunctions = {
	error: {
		/**
		 * Unknown error occurred 😞
		 */
		unknown: () => LocalizedString
		/**
		 * Something went wrong. Try again later.
		 */
		general: () => LocalizedString
		/**
		 * Could not find system named `{systemName}`.
		 */
		systemNotFound: (arg: { systemName: unknown }) => LocalizedString
		/**
		 * Could not fetch tick data. 
	Check [this site](https://elitebgs.app/tick).
		 */
		tickFetchError: () => LocalizedString
		/**
		 * Could not parse data.
		 */
		dataParseError: () => LocalizedString
		/**
		 * These buttons aren't for you!
		 */
		buttonsDisabled: () => LocalizedString
	}
	copilot: {
		faction: {
			/**
			 * Could not find any factions with that name.
			 */
			notFound: () => LocalizedString
			confirm: {
				/**
				 * Is this information correct?
				 */
				title: () => LocalizedString
				/**
				 * Name: {factionName}
			Shorthand: {factionShorthand}
			Allegiance: {allegiance}
			Systems present: {systemsCount}
				 */
				description: (arg: { allegiance: unknown, factionName: unknown, factionShorthand: unknown, systemsCount: unknown }) => LocalizedString
			}
			/**
			 * Faction saved.
			 */
			saved: () => LocalizedString
			/**
			 * Faction setup canceled.
			 */
			canceled: () => LocalizedString
		}
		language: {
			/**
			 * Language settings saved.
			 */
			saved: () => LocalizedString
		}
		timezone: {
			/**
			 * Timezone settings saved.
			 */
			saved: () => LocalizedString
			/**
			 * Timezone setup canceled. If you are having trouble setting up timezone, try to find your timezone on [this site](https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a).
			 */
			canceled: () => LocalizedString
			/**
			 * Could not find timezone with that name. Try to find your timezone on [this site](https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a).
			 */
			notFound: () => LocalizedString
			confirm: {
				/**
				 * Is this information correct?
				 */
				title: () => LocalizedString
				/**
				 * Current time: {currentTime}
				 */
				description: (arg: { currentTime: unknown }) => LocalizedString
			}
		}
		tickReportChannel: {
			/**
			 * Current tick reporting channel
			 */
			title: () => LocalizedString
			/**
			 * Channel: {channel}
		 Are you sure you want to remove it?
			 */
			description: (arg: { channel: unknown }) => LocalizedString
			/**
			 * Channel: -
			 */
			descriptionNoChannel: () => LocalizedString
			/**
			 * Channel {channel} will now be used for reporting game ticks.
			 */
			saved: (arg: { channel: unknown }) => LocalizedString
			/**
			 * Tick reporting channel removed.
			 */
			removed: () => LocalizedString
			/**
			 * Channel {channel} will remain used for reporting game ticks.
			 */
			notRemoved: (arg: { channel: unknown }) => LocalizedString
		}
	}
	faction: {
		/**
		 * Faction is not setup.
		 */
		notSetup: () => LocalizedString
		conflicts: {
			/**
			 * {factionName} Conflicts
			 */
			title: (arg: { factionName: unknown }) => LocalizedString
			/**
			 * No conflicts 🎉
			 */
			noConflicts: () => LocalizedString
			/**
			 * Pending
			 */
			pendingConflict: () => LocalizedString
		}
		systems: {
			/**
			 * {factionName} Systems
			 */
			title: (arg: { factionName: unknown }) => LocalizedString
		}
		stations: {
			/**
			 * {factionName} Stations
			 */
			title: (arg: { factionName: unknown }) => LocalizedString
		}
	}
	techBroker: {
		/**
		 * Technology Brokers
		 */
		title: () => LocalizedString
	}
	materialTrader: {
		/**
		 * Material Traders
		 */
		title: () => LocalizedString
	}
	interstellarFactors: {
		/**
		 * Interstellar Factors
		 */
		title: () => LocalizedString
	}
	tick: {
		/**
		 * Last TICK
		 */
		title: () => LocalizedString
		/**
		 * Today
		 */
		wasToday: () => LocalizedString
		/**
		 * Tick history
		 */
		history: () => LocalizedString
	}
	systemInfo: {
		/**
		 * Factions in {systemName}
		 */
		title: (arg: { systemName: unknown }) => LocalizedString
		/**
		 * Last update: {time}
		 */
		lastUpdate: (arg: { time: unknown }) => LocalizedString
	}
	commanderProfile: {
		/**
		 * Could not find commander profile.
	Add your CMDR name and EDSM API key using `/setup profile` command.
		 */
		notFound: () => LocalizedString
		/**
		 * To see account balance, you need to add your EDSM API key using `/setup profile` command.
		 */
		missingEdsmKey: () => LocalizedString
	}
	setup: {
		profile: {
			/**
			 * Profile settings saved.
			 */
			saved: () => LocalizedString
		}
	}
}

export type Formatters = {}