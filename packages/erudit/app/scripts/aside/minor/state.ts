import type { InjectionKey, ShallowRef } from 'vue';
import type {
    AsideMinorData,
    AsideMinorNews,
    AsideMinorTopic,
    AsideMinorType,
} from '@shared/asideMinor';

export const asideMinorKey = Symbol() as InjectionKey<
    ShallowRef<AsideMinorData>
>;

export function injectAsideData<T extends AsideMinorData>() {
    return inject(asideMinorKey) as ShallowRef<T>;
}

// export function injectTopicData(): Ref<AsideMinorTopic>
// {
//     const dataRef = inject(asideMinorKey);
//     return createTypeSafeDataComputed(dataRef, 'topic') as any;
// }

// export function injectNewsData(): Ref<AsideMinorNews>
// {
//     const dataRef = inject(asideMinorKey);
//     return createTypeSafeDataComputed(dataRef, 'news') as any;
// }

// function createTypeSafeDataComputed(dataRef: Ref<AsideMinorData>, targetType: AsideMinorType)
// {
//     return computed(() => {
//         if (dataRef.value.type !== targetType)
//             throw new Error(`Aside minor data type mismatch! Expected "${targetType}", got "${dataRef.value.type}"!`);

//         return dataRef.value;
//     });
// }
