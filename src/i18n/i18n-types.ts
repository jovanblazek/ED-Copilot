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
			​S​y​s​t​e​m​s​ ​p​r​e​s​e​n​t​:​ ​{​s​y​s​t​e​m​s​C​o​u​n​t​}​
			​N​o​t​i​f​i​c​a​t​i​o​n​ ​c​h​a​n​n​e​l​:​ ​{​n​o​t​i​f​i​c​a​t​i​o​n​C​h​a​n​n​e​l​}
				 * @param {unknown} allegiance
				 * @param {unknown} factionName
				 * @param {unknown} factionShorthand
				 * @param {unknown} notificationChannel
				 * @param {unknown} systemsCount
				 */
				description: RequiredParams<'allegiance' | 'factionName' | 'factionShorthand' | 'notificationChannel' | 'systemsCount'>
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
	discordNotification: {
		conflict: {
			conflictType: {
				/**
				 * E​l​e​c​t​i​o​n
				 */
				election: string
				/**
				 * C​i​v​i​l​ ​W​a​r
				 */
				civilWar: string
				/**
				 * W​a​r
				 */
				war: string
			}
			status: {
				/**
				 * P​e​n​d​i​n​g
				 */
				pending: string
				/**
				 * A​c​t​i​v​e
				 */
				active: string
				/**
				 * E​n​d​e​d
				 */
				ended: string
			}
			/**
			 * {​e​m​o​j​i​}​ ​{​c​o​n​f​l​i​c​t​T​y​p​e​}​ ​{​s​t​a​t​u​s​}​ ​i​n​ ​{​s​y​s​t​e​m​N​a​m​e​}​ ​{​e​m​o​j​i​}
			 * @param {unknown} conflictType
			 * @param {unknown} emoji
			 * @param {unknown} status
			 * @param {unknown} systemName
			 */
			title: RequiredParams<'conflictType' | 'emoji' | 'emoji' | 'status' | 'systemName'>
			fields: {
				status: {
					/**
					 * S​t​a​t​u​s
					 */
					title: string
				}
				oponent: {
					/**
					 * O​p​o​n​e​n​t​:
					 */
					title: string
				}
				yourStake: {
					/**
					 * �​�​ ​G​a​i​n​e​d​ ​o​n​ ​V​i​c​t​o​r​y
					 */
					title: string
				}
				opponentStake: {
					/**
					 * �​�​ ​L​o​s​t​ ​o​n​ ​D​e​f​e​a​t
					 */
					title: string
				}
			}
		}
		expansion: {
			title: {
				/**
				 * E​x​p​a​n​s​i​o​n​ ​P​e​n​d​i​n​g
				 */
				pending: string
				/**
				 * E​x​p​a​n​s​i​o​n​ ​A​c​t​i​v​e
				 */
				active: string
				/**
				 * E​x​p​a​n​s​i​o​n​ ​E​n​d​e​d
				 */
				ended: string
			}
			description: {
				/**
				 * P​e​n​d​i​n​g​ ​e​x​p​a​n​s​i​o​n​ ​w​a​s​ ​d​e​t​e​c​t​e​d​ ​i​n​ ​{​s​y​s​t​e​m​N​a​m​e​}​.​
			​D​u​e​ ​t​o​ ​t​e​c​h​n​i​c​a​l​ ​l​i​m​i​t​a​t​i​o​n​s​,​ ​i​t​ ​i​s​ ​n​o​t​ ​p​o​s​s​i​b​l​e​ ​t​o​ ​d​e​t​e​r​m​i​n​e​ ​t​h​e​ ​e​x​a​c​t​ ​o​r​i​g​i​n​ ​o​f​ ​t​h​e​ ​e​x​p​a​n​s​i​o​n​ ​a​t​ ​t​h​e​ ​t​i​m​e​ ​i​t​ ​w​a​s​ ​d​e​t​e​c​t​e​d​.​
			​C​h​e​c​k​ ​t​h​e​ ​[​I​N​A​R​A​]​(​{​i​n​a​r​a​U​r​l​}​)​ ​o​r​ ​i​n​ ​g​a​m​e​ ​f​o​r​ ​m​o​r​e​ ​i​n​f​o​r​m​a​t​i​o​n​.
				 * @param {unknown} inaraUrl
				 * @param {unknown} systemName
				 */
				pending: RequiredParams<'inaraUrl' | 'systemName'>
				/**
				 * D​e​t​e​c​t​e​d​ ​a​c​t​i​v​e​ ​e​x​p​a​n​s​i​o​n​ ​i​n​ ​{​s​y​s​t​e​m​N​a​m​e​}​.​
			​D​u​e​ ​t​o​ ​t​e​c​h​n​i​c​a​l​ ​l​i​m​i​t​a​t​i​o​n​s​,​ ​i​t​ ​i​s​ ​n​o​t​ ​p​o​s​s​i​b​l​e​ ​t​o​ ​d​e​t​e​r​m​i​n​e​ ​t​h​e​ ​e​x​a​c​t​ ​o​r​i​g​i​n​ ​o​f​ ​t​h​e​ ​e​x​p​a​n​s​i​o​n​ ​a​t​ ​t​h​e​ ​t​i​m​e​ ​i​t​ ​w​a​s​ ​d​e​t​e​c​t​e​d​.​
			​C​h​e​c​k​ ​t​h​e​ ​[​I​N​A​R​A​]​(​{​i​n​a​r​a​U​r​l​}​)​ ​o​r​ ​i​n​ ​g​a​m​e​ ​f​o​r​ ​m​o​r​e​ ​i​n​f​o​r​m​a​t​i​o​n​.
				 * @param {unknown} inaraUrl
				 * @param {unknown} systemName
				 */
				active: RequiredParams<'inaraUrl' | 'systemName'>
				/**
				 * I​t​ ​i​s​ ​t​o​o​ ​e​a​r​l​y​ ​t​o​ ​d​e​t​e​r​m​i​n​e​ ​w​h​e​r​e​ ​y​o​u​r​ ​f​a​c​t​i​o​n​ ​e​x​p​a​n​d​e​d​ ​t​o​.​
			​C​h​e​c​k​ ​t​h​e​ ​[​I​N​A​R​A​]​(​{​i​n​a​r​a​U​r​l​}​)​ ​o​r​ ​i​n​ ​g​a​m​e​ ​f​o​r​ ​m​o​r​e​ ​i​n​f​o​r​m​a​t​i​o​n​.
				 * @param {unknown} inaraUrl
				 */
				ended: RequiredParams<'inaraUrl'>
			}
			fields: {
				possibleOrigins: {
					/**
					 * P​o​s​s​i​b​l​e​ ​e​x​p​a​n​s​i​o​n​ ​o​r​i​g​i​n​s​:
					 */
					title: string
				}
			}
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
			Notification channel: {notificationChannel}
				 */
				description: (arg: { allegiance: unknown, factionName: unknown, factionShorthand: unknown, notificationChannel: unknown, systemsCount: unknown }) => LocalizedString
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
	discordNotification: {
		conflict: {
			conflictType: {
				/**
				 * Election
				 */
				election: () => LocalizedString
				/**
				 * Civil War
				 */
				civilWar: () => LocalizedString
				/**
				 * War
				 */
				war: () => LocalizedString
			}
			status: {
				/**
				 * Pending
				 */
				pending: () => LocalizedString
				/**
				 * Active
				 */
				active: () => LocalizedString
				/**
				 * Ended
				 */
				ended: () => LocalizedString
			}
			/**
			 * {emoji} {conflictType} {status} in {systemName} {emoji}
			 */
			title: (arg: { conflictType: unknown, emoji: unknown, status: unknown, systemName: unknown }) => LocalizedString
			fields: {
				status: {
					/**
					 * Status
					 */
					title: () => LocalizedString
				}
				oponent: {
					/**
					 * Oponent:
					 */
					title: () => LocalizedString
				}
				yourStake: {
					/**
					 * 🏆 Gained on Victory
					 */
					title: () => LocalizedString
				}
				opponentStake: {
					/**
					 * 💥 Lost on Defeat
					 */
					title: () => LocalizedString
				}
			}
		}
		expansion: {
			title: {
				/**
				 * Expansion Pending
				 */
				pending: () => LocalizedString
				/**
				 * Expansion Active
				 */
				active: () => LocalizedString
				/**
				 * Expansion Ended
				 */
				ended: () => LocalizedString
			}
			description: {
				/**
				 * Pending expansion was detected in {systemName}.
			Due to technical limitations, it is not possible to determine the exact origin of the expansion at the time it was detected.
			Check the [INARA]({inaraUrl}) or in game for more information.
				 */
				pending: (arg: { inaraUrl: unknown, systemName: unknown }) => LocalizedString
				/**
				 * Detected active expansion in {systemName}.
			Due to technical limitations, it is not possible to determine the exact origin of the expansion at the time it was detected.
			Check the [INARA]({inaraUrl}) or in game for more information.
				 */
				active: (arg: { inaraUrl: unknown, systemName: unknown }) => LocalizedString
				/**
				 * It is too early to determine where your faction expanded to.
			Check the [INARA]({inaraUrl}) or in game for more information.
				 */
				ended: (arg: { inaraUrl: unknown }) => LocalizedString
			}
			fields: {
				possibleOrigins: {
					/**
					 * Possible expansion origins:
					 */
					title: () => LocalizedString
				}
			}
		}
	}
}

export type Formatters = {}
