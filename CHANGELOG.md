## [3.0.0](https://github.com/jovanblazek/ed-copilot/compare/v2.4.0...v3.0.0) (2025-02-12)

### ⚠ BREAKING CHANGES

* Refactored database schema - DATA LOSS IS EXPECTED - I did not bother to create a proper migration since the bot is not public yet. If you are running a fork, or self hosting the bot you would have to migrate the data manually

### :sparkles: Features

* Faction state monitoring using EDDN ([#32](https://github.com/jovanblazek/ed-copilot/issues/32)) ([545b6d2](https://github.com/jovanblazek/ed-copilot/commit/545b6d2229be3cf0efa93031ec2ad0b26304c126))

### :up: Enhancements

* Enable lazy connection for Redis and update logging ([#31](https://github.com/jovanblazek/ed-copilot/issues/31)) ([1044f4a](https://github.com/jovanblazek/ed-copilot/commit/1044f4af988bc90dd7a16608fe7611c52551ddbc))

## [2.4.0](https://github.com/jovanblazek/ed-copilot/compare/v2.3.2...v2.4.0) (2024-09-08)

### :sparkles: Features

* Add redis cache and cache ticktime ([#27](https://github.com/jovanblazek/ed-copilot/issues/27)) ([dce4451](https://github.com/jovanblazek/ed-copilot/commit/dce4451c7771a520949912c3e4e2c98b8cafb707))

## [2.3.2](https://github.com/jovanblazek/ed-copilot/compare/v2.3.1...v2.3.2) (2024-09-08)

### :bug: Bug Fixes

* Revert changes to package json made in [#28](https://github.com/jovanblazek/ed-copilot/issues/28) ([#29](https://github.com/jovanblazek/ed-copilot/issues/29)) ([4cac908](https://github.com/jovanblazek/ed-copilot/commit/4cac9085a2971717ec7b35777bd3dcf05a3acbbd))

## [2.3.1](https://github.com/jovanblazek/ed-copilot/compare/v2.3.0...v2.3.1) (2024-09-08)

### :bug: Bug Fixes

* Nixpacks build failing due to permissions ([#28](https://github.com/jovanblazek/ed-copilot/issues/28)) ([bad00c4](https://github.com/jovanblazek/ed-copilot/commit/bad00c45fc601b75dee36f906cba660fb16f2016))

### :up: Enhancements

* Replace old libraries ([#26](https://github.com/jovanblazek/ed-copilot/issues/26)) ([1163139](https://github.com/jovanblazek/ed-copilot/commit/1163139979486d1585741d0cfee5211fc2dee0e7))

## [2.3.0](https://github.com/jovanblazek/ed-copilot/compare/v2.2.1...v2.3.0) (2024-07-27)

### :sparkles: Features

* Group trader, broker & factors command under nearest command ([#25](https://github.com/jovanblazek/ed-copilot/issues/25)) ([e042db1](https://github.com/jovanblazek/ed-copilot/commit/e042db1f67efd93ab42050ceb4a4c7330f16eb05))

## [2.2.1](https://github.com/jovanblazek/ed-copilot/compare/v2.2.0...v2.2.1) (2024-06-23)

### :bug: Bug Fixes

* Add pnpm version to package json & update readme ([#24](https://github.com/jovanblazek/ed-copilot/issues/24)) ([72a3d04](https://github.com/jovanblazek/ed-copilot/commit/72a3d04e40fea5232a6e99a2dd57736a4512bd02))

## [2.2.0](https://github.com/jovanblazek/ed-copilot/compare/v2.1.0...v2.2.0) (2024-06-23)

### :sparkles: Features

* Migrate to Node 20, pnpm and upgrade packages ([#23](https://github.com/jovanblazek/ed-copilot/issues/23)) ([9a98a56](https://github.com/jovanblazek/ed-copilot/commit/9a98a56196457c6b27ecf533977cb46d6abf6fb2))

## [2.1.0](https://github.com/jovanblazek/ed-copilot/compare/v2.0.1...v2.1.0) (2024-06-09)


### :sparkles: Features

* Add health check endpoint ([#21](https://github.com/jovanblazek/ed-copilot/issues/21)) ([c9365ba](https://github.com/jovanblazek/ed-copilot/commit/c9365babdcd8d8deeff189f4f7616363b6747b63))


### :bug: Bug Fixes

* Release not working due to branch protection ([#22](https://github.com/jovanblazek/ed-copilot/issues/22)) ([a5bf51b](https://github.com/jovanblazek/ed-copilot/commit/a5bf51b580bbf9e8f23157d6fd7a549e0faf0fb7))


### :up: Enhancements

* Add pagination support for faction commands ([#17](https://github.com/jovanblazek/ed-copilot/issues/17)) ([5541850](https://github.com/jovanblazek/ed-copilot/commit/5541850393dec2f07983c7273be196587df5a6fb))


### :octopus: Miscellaneous Chores

* Update node to 18.20.3 & remove ssh deploy ([#20](https://github.com/jovanblazek/ed-copilot/issues/20)) ([629975b](https://github.com/jovanblazek/ed-copilot/commit/629975b79e0544799a5815dff6ec4be4e7166abc))

## [2.0.1](https://github.com/jovanblazek/ed-copilot/compare/v2.0.0...v2.0.1) (2023-08-09)


### :bug: Bug Fixes

* Update tick detector's reconnection delay ([#16](https://github.com/jovanblazek/ed-copilot/issues/16)) ([0c3468f](https://github.com/jovanblazek/ed-copilot/commit/0c3468f4b725f303da4c46007245c429707bbb9d))

## [2.0.0](https://github.com/jovanblazek/ed-copilot/compare/v1.0.0...v2.0.0) (2023-08-06)


### ⚠ BREAKING CHANGES

* Initial release of ED-Copilot. This replaces the old, hardcoded version of the bot. However, the old version is still available under v1 release.

### :sparkles: Features

* Initial release of ED-Copilot 🎉 ([#13](https://github.com/jovanblazek/ed-copilot/issues/13)) ([b8e708d](https://github.com/jovanblazek/ed-copilot/commit/b8e708d6ab0fd37051d820efa536ce55aaa6f66d))
