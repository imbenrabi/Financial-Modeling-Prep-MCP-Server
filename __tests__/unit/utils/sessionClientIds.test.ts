import { describe, it, expect } from 'vitest';
import { ServerResponse, IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { SessionClientIds, onSessionIdIssued } from '../../../src/utils/sessionClientIds.js';

function createResponse(): ServerResponse {
  return new ServerResponse(new IncomingMessage(new Socket()));
}

describe('SessionClientIds', () => {
  it('returns the client ID recorded for a session', () => {
    const ids = new SessionClientIds();
    ids.set('session-1', 'auto-a');

    expect(ids.get('session-1')).toBe('auto-a');
    expect(ids.get('unknown')).toBeUndefined();
  });

  it('forgets the least recently used session once full', () => {
    const ids = new SessionClientIds(2);
    ids.set('session-1', 'auto-a');
    ids.set('session-2', 'auto-b');
    ids.get('session-1');
    ids.set('session-3', 'auto-c');

    expect(ids.get('session-1')).toBe('auto-a');
    expect(ids.get('session-2')).toBeUndefined();
    expect(ids.get('session-3')).toBe('auto-c');
  });

  it('overwrites a session without evicting another', () => {
    const ids = new SessionClientIds(2);
    ids.set('session-1', 'auto-a');
    ids.set('session-2', 'auto-b');
    ids.set('session-1', 'auto-c');

    expect(ids.get('session-1')).toBe('auto-c');
    expect(ids.get('session-2')).toBe('auto-b');
  });
});

describe('onSessionIdIssued', () => {
  it('reports the session ID passed to writeHead', () => {
    const res = createResponse();
    const issued: string[] = [];
    onSessionIdIssued(res, (sessionId) => issued.push(sessionId));

    res.writeHead(200, { 'content-type': 'text/event-stream', 'mcp-session-id': 'session-1' });

    expect(issued).toEqual(['session-1']);
    expect(res.statusCode).toBe(200);
  });

  it('reports a session ID set with setHeader before writeHead', () => {
    const res = createResponse();
    const issued: string[] = [];
    onSessionIdIssued(res, (sessionId) => issued.push(sessionId));

    res.setHeader('mcp-session-id', 'session-2');
    res.writeHead(200, 'OK');

    expect(issued).toEqual(['session-2']);
  });

  it('reports the session ID with a status message, mixed-case name, and returns the response', () => {
    const res = createResponse();
    const issued: string[] = [];
    onSessionIdIssued(res, (sessionId) => issued.push(sessionId));

    const written = res.writeHead(200, 'OK', { 'Mcp-Session-Id': 'session-3' });

    expect(issued).toEqual(['session-3']);
    expect(written).toBe(res);
  });

  it('reports the session ID from a flat header array', () => {
    const res = createResponse();
    const issued: string[] = [];
    onSessionIdIssued(res, (sessionId) => issued.push(sessionId));

    res.writeHead(200, ['content-type', 'text/event-stream', 'mcp-session-id', 'session-4']);

    expect(issued).toEqual(['session-4']);
  });

  it('reports nothing when the response carries no session ID', () => {
    const res = createResponse();
    const issued: string[] = [];
    onSessionIdIssued(res, (sessionId) => issued.push(sessionId));

    res.writeHead(400, { 'content-type': 'application/json' });

    expect(issued).toEqual([]);
    expect(res.statusCode).toBe(400);
  });
});
