import { useProseAppContext } from './appContext';

export function useIcon() {
    const { MaybeMyIcon } = useProseAppContext();
    return MaybeMyIcon;
}
