revoke delete on table "public"."messages" from "anon";

revoke insert on table "public"."messages" from "anon";

revoke references on table "public"."messages" from "anon";

revoke select on table "public"."messages" from "anon";

revoke trigger on table "public"."messages" from "anon";

revoke truncate on table "public"."messages" from "anon";

revoke update on table "public"."messages" from "anon";

revoke delete on table "public"."messages" from "authenticated";

revoke insert on table "public"."messages" from "authenticated";

revoke references on table "public"."messages" from "authenticated";

revoke select on table "public"."messages" from "authenticated";

revoke trigger on table "public"."messages" from "authenticated";

revoke truncate on table "public"."messages" from "authenticated";

revoke update on table "public"."messages" from "authenticated";

revoke delete on table "public"."messages" from "service_role";

revoke insert on table "public"."messages" from "service_role";

revoke references on table "public"."messages" from "service_role";

revoke select on table "public"."messages" from "service_role";

revoke trigger on table "public"."messages" from "service_role";

revoke truncate on table "public"."messages" from "service_role";

revoke update on table "public"."messages" from "service_role";

alter table "public"."messages" drop constraint "messages_chat_id_fkey";

alter table "public"."messages" drop constraint "messages_role_check";

alter table "public"."messages" drop constraint "messages_pkey";

drop index if exists "public"."messages_pkey";

drop table "public"."messages";

alter table "public"."chats" add column "messages" jsonb[];


grant delete on table "vecs"."bloodborne" to "anon";

grant insert on table "vecs"."bloodborne" to "anon";

grant references on table "vecs"."bloodborne" to "anon";

grant trigger on table "vecs"."bloodborne" to "anon";

grant truncate on table "vecs"."bloodborne" to "anon";

grant update on table "vecs"."bloodborne" to "anon";

grant delete on table "vecs"."bloodborne" to "authenticated";

grant insert on table "vecs"."bloodborne" to "authenticated";

grant references on table "vecs"."bloodborne" to "authenticated";

grant select on table "vecs"."bloodborne" to "authenticated";

grant trigger on table "vecs"."bloodborne" to "authenticated";

grant truncate on table "vecs"."bloodborne" to "authenticated";

grant update on table "vecs"."bloodborne" to "authenticated";

grant delete on table "vecs"."bloodborne" to "service_role";

grant insert on table "vecs"."bloodborne" to "service_role";

grant references on table "vecs"."bloodborne" to "service_role";

grant select on table "vecs"."bloodborne" to "service_role";

grant trigger on table "vecs"."bloodborne" to "service_role";

grant truncate on table "vecs"."bloodborne" to "service_role";

grant update on table "vecs"."bloodborne" to "service_role";

grant delete on table "vecs"."eldenring" to "anon";

grant insert on table "vecs"."eldenring" to "anon";

grant references on table "vecs"."eldenring" to "anon";

grant trigger on table "vecs"."eldenring" to "anon";

grant truncate on table "vecs"."eldenring" to "anon";

grant update on table "vecs"."eldenring" to "anon";

grant delete on table "vecs"."eldenring" to "authenticated";

grant insert on table "vecs"."eldenring" to "authenticated";

grant references on table "vecs"."eldenring" to "authenticated";

grant select on table "vecs"."eldenring" to "authenticated";

grant trigger on table "vecs"."eldenring" to "authenticated";

grant truncate on table "vecs"."eldenring" to "authenticated";

grant update on table "vecs"."eldenring" to "authenticated";

grant delete on table "vecs"."eldenring" to "service_role";

grant insert on table "vecs"."eldenring" to "service_role";

grant references on table "vecs"."eldenring" to "service_role";

grant select on table "vecs"."eldenring" to "service_role";

grant trigger on table "vecs"."eldenring" to "service_role";

grant truncate on table "vecs"."eldenring" to "service_role";

grant update on table "vecs"."eldenring" to "service_role";

grant delete on table "vecs"."hollowknight" to "anon";

grant insert on table "vecs"."hollowknight" to "anon";

grant references on table "vecs"."hollowknight" to "anon";

grant trigger on table "vecs"."hollowknight" to "anon";

grant truncate on table "vecs"."hollowknight" to "anon";

grant update on table "vecs"."hollowknight" to "anon";

grant delete on table "vecs"."hollowknight" to "authenticated";

grant insert on table "vecs"."hollowknight" to "authenticated";

grant references on table "vecs"."hollowknight" to "authenticated";

grant select on table "vecs"."hollowknight" to "authenticated";

grant trigger on table "vecs"."hollowknight" to "authenticated";

grant truncate on table "vecs"."hollowknight" to "authenticated";

grant update on table "vecs"."hollowknight" to "authenticated";

grant delete on table "vecs"."hollowknight" to "service_role";

grant insert on table "vecs"."hollowknight" to "service_role";

grant references on table "vecs"."hollowknight" to "service_role";

grant select on table "vecs"."hollowknight" to "service_role";

grant trigger on table "vecs"."hollowknight" to "service_role";

grant truncate on table "vecs"."hollowknight" to "service_role";

grant update on table "vecs"."hollowknight" to "service_role";

grant delete on table "vecs"."valheim" to "anon";

grant insert on table "vecs"."valheim" to "anon";

grant references on table "vecs"."valheim" to "anon";

grant trigger on table "vecs"."valheim" to "anon";

grant truncate on table "vecs"."valheim" to "anon";

grant update on table "vecs"."valheim" to "anon";

grant delete on table "vecs"."valheim" to "authenticated";

grant insert on table "vecs"."valheim" to "authenticated";

grant references on table "vecs"."valheim" to "authenticated";

grant trigger on table "vecs"."valheim" to "authenticated";

grant truncate on table "vecs"."valheim" to "authenticated";

grant update on table "vecs"."valheim" to "authenticated";

grant delete on table "vecs"."valheim" to "service_role";

grant insert on table "vecs"."valheim" to "service_role";

grant references on table "vecs"."valheim" to "service_role";

grant trigger on table "vecs"."valheim" to "service_role";

grant truncate on table "vecs"."valheim" to "service_role";

grant update on table "vecs"."valheim" to "service_role";



