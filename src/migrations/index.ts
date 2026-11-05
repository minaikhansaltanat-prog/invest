import * as migration_20261105_034540_initial from './20261105_034540_initial';
import * as migration_20261105_191427_blob_prefix from './20261105_191427_blob_prefix';

export const migrations = [
  {
    up: migration_20261105_034540_initial.up,
    down: migration_20261105_034540_initial.down,
    name: '20261105_034540_initial',
  },
  {
    up: migration_20261105_191427_blob_prefix.up,
    down: migration_20261105_191427_blob_prefix.down,
    name: '20261105_191427_blob_prefix'
  },
];
