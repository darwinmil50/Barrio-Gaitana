import { describe, expect, it } from 'vitest';
import { envelopeCount, isEnvelope, isLocality } from './envelope';
import { envelope, place, source } from '../test/fixtures';

describe('envelope', () => {
  it('valida la forma del envelope del backend', () => {
    expect(isEnvelope(envelope([]))).toBe(true);
    expect(isEnvelope({ scope: 'neighborhood' })).toBe(false);
    expect(isEnvelope(null)).toBe(false);
  });

  it('distingue alcance barrio/localidad y cuenta registros', () => {
    const local = envelope([place('a', 'A')], { scope: 'locality' });
    expect(isLocality(local)).toBe(true);
    expect(isLocality(envelope([]))).toBe(false);
    expect(envelopeCount(local)).toBe(1);
    expect(local.source).toEqual(source);
  });
});
