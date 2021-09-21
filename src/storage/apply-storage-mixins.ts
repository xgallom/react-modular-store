import {BaseStorage, BaseStorageMixin, Storage} from './interface';

export const applyStorageMixins = (mixins: BaseStorageMixin[], storage: BaseStorage) =>
    <T extends {} = Record<string, any>>(): Storage<T> => mixins.reduceRight(
        (storage, mixin) => mixin(storage),
        storage,
    ) as Storage<T>;
