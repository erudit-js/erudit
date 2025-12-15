import { useProseContext } from './context.js';

export function useFormatText() {
    const { formatText } = useProseContext();
    return formatText;
}
