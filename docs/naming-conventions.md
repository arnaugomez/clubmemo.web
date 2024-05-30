# File and class naming conventions

## Domain layer

- Entities: `*Model`
- Use Case Controllers: `*UseCase`
- Input and Output of methods: `*InputModel`, `*OutputModel`
- Interfaces: does not have a specific suffix or prefix. Avoid using the `I` prefix or the `Interface` suffix.
- Service locator: `*Locator`

## Data layer

- Services: `*Service`
- Repositories: `*Repository`
- Data Models: `*DataModel`
- Collections: `*Collection`
- Facets: `*Facet`
- Transformers (data mappers): `*Transformer`
- Implementation of an interface: `*Impl`

## UI layer

- Async loader component that suspends the React UI: `*Loader`
- Non-async component that shows the loaded data: `*Loaded`
- Loading component that shows a loading indicator: `*Loading`
- Empty state: `*EmptyState`
