export type AuthFieldErrors = Record<string, string>;

export type AuthActionResult =
  | {
      ok: true;
      message: string;
      redirectTo?: string;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: AuthFieldErrors;
    };
