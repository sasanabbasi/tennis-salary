export interface IConverter<TInput, TOutput> {
  convert(input: TInput, mainPlayerId: number): TOutput;
}
