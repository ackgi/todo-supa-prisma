// src/server/errors/domain-errors.ts
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class AuthError extends DomainError {}
export class PermissionDenied extends DomainError {}
