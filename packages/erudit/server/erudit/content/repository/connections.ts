import { getContentDependencies, getContentDependents } from './deps';
import { getContentExternals } from './externals';

export async function getContentConnections(
  fullId: string,
): Promise<ContentConnections | undefined> {
  const { hardDependencies, autoDependencies } =
    await getContentDependencies(fullId);
  const dependents = await getContentDependents(fullId);
  const externals = await getContentExternals(fullId);

  const connections: ContentConnections = {};

  if (hardDependencies.length > 0) {
    connections.hardDependencies = hardDependencies;
  }

  if (autoDependencies.length > 0) {
    connections.autoDependencies = autoDependencies;
  }

  if (dependents.length > 0) {
    connections.dependents = dependents;
  }

  if (externals.length > 0) {
    connections.externals = externals;
  }

  if (Object.keys(connections).length === 0) {
    return undefined;
  }

  return connections;
}
