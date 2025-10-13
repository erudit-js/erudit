import { useProseAppContext } from './appContext';

export function useFormatText() {
    const { formatText } = useProseAppContext();
    return formatText;
}
