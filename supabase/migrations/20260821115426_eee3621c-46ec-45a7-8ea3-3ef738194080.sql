REVOKE EXECUTE ON FUNCTION public.resolve_login_email(text) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.identifier_available(text, text) FROM anon, authenticated, PUBLIC;