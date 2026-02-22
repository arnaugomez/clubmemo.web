/**
 * The data of an admin resource. It is an object with keys that are the fields
 * of the resource, and their values. The keys and their values depend on the
 * fields configuration of that specific admin resource.
 */
// biome-ignore lint/suspicious/noExplicitAny: generic admin resource type
export type AdminResourceData = Record<string, any>;
