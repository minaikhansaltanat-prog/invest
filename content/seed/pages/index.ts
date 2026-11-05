import { pagesA, servicesDetailSeed } from './group-a'
import { pagesB } from './group-b'
import { pagesC } from './group-c'
import type { SeedPage } from './types'

export { servicesDetailSeed }
export type { SeedBlock, SeedCta, SeedPage, ServiceDetailSeed } from './types'

/** Барлық статикалық беттер (Payload `pages` жинағына егіледі) */
export const allPagesSeed: SeedPage[] = [...pagesA, ...pagesB, ...pagesC]
