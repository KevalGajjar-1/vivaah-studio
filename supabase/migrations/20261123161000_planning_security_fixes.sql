
alter function public.set_updated_at() set search_path = public;
alter function public.set_wedding_owner() set search_path = public;

revoke all on function public.is_wedding_owner(uuid) from public, anon;
grant execute on function public.is_wedding_owner(uuid) to authenticated;

revoke all on function public.consume_tool_quota(text, text, integer) from public;
grant execute on function public.consume_tool_quota(text, text, integer) to anon, authenticated;
