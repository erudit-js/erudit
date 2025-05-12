import type { EruditBitranRuntime } from '@erudit-js/cog/schema';

import type { ProblemNode, ProblemsNode } from './shared';
import { resolveGeneratorPath } from './server';

export function generatorApiRoute(generatorPath: string) {
    return `/api/problem/generator/${generatorPath}.js`;
}

export function prerenderProblem(problem: ProblemNode) {
    const generatorPath = problem.renderData?.generatorContentPath;
    if (generatorPath) {
        return generatorApiRoute(generatorPath);
    }
}

export async function prerenderProblems(
    problems: ProblemsNode,
    runtime: EruditBitranRuntime,
) {
    const generatorPaths = problems.parseData.set
        .filter((item) => Boolean(item.generatorSrc))
        .map((problem) => problem.generatorSrc!);

    const routes: string[] = [];

    for (const generatorPath of generatorPaths) {
        const generatorContentPath = await resolveGeneratorPath(
            generatorPath,
            runtime.context.location.path!,
        );
        routes.push(generatorApiRoute(generatorContentPath));
    }

    return routes;
}
