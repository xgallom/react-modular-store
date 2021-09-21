import {BaseStorage, BaseStorageMixin, Storage} from './interface';

export const applyStorageMixins =
    <T extends {} = Record<string, any>>(
        mixins: BaseStorageMixin[],
        storage: BaseStorage,
    ): Storage<T> =>
        mixins.reduceRight(
            (storage, mixin) => mixin(storage),
            storage,
        ) as Storage<T>;
