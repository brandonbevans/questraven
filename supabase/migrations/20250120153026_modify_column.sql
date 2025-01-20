alter table "public"."messages" drop constraint "messages_role_check";

alter table "public"."messages" drop column "content";

alter table "public"."messages" add column "text" text not null;

CREATE UNIQUE INDEX unique_user_game ON public.chats USING btree (user_id, game_id);

alter table "public"."chats" add constraint "unique_user_game" UNIQUE using index "unique_user_game";

alter table "public"."messages" add constraint "messages_role_check" CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'assistant'::character varying])::text[]))) not valid;

alter table "public"."messages" validate constraint "messages_role_check";



