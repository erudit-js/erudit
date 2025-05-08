import {
    ParseFactory,
    Parser,
    Stringifier,
    StringifyFactory,
} from '@bitran-js/transpiler';

import type { BitranContext } from './context';
import type { EruditConfig } from '../erudit/config';

export interface EruditBitranRuntime {
    eruditConfig: Partial<EruditConfig>;
    context: BitranContext;
    insideInclude: boolean;
}

export interface EruditBitranRuntimeHolder {
    _runtime: EruditBitranRuntime;
}

export function asRuntimeHolder(holder: any): EruditBitranRuntimeHolder {
    return holder as EruditBitranRuntimeHolder;
}

export function setEruditBitranRuntime(
    factory: Parser | Stringifier,
    runtime: EruditBitranRuntime,
) {
    asRuntimeHolder(factory)._runtime = runtime;
}

export function tryGetEruditBitranRuntime(
    runtimeHolder: any,
): EruditBitranRuntime | undefined {
    if (runtimeHolder instanceof ParseFactory)
        return asRuntimeHolder(runtimeHolder.parser)._runtime;
    if (runtimeHolder instanceof StringifyFactory)
        return asRuntimeHolder(runtimeHolder.stringifier)._runtime;

    return asRuntimeHolder(runtimeHolder)?._runtime;
}

export function getEruditBitranRuntime(runtimeHolder: any) {
    const runtime = tryGetEruditBitranRuntime(runtimeHolder);
    if (!runtime) throw new Error('Erudit Bitran runtime object is not set!');
    return runtime;
}
