create extension if not exists "vector" with schema "public" version '0.8.0';

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.test()
 RETURNS TABLE(id uuid, similarity double precision, text text)
 LANGUAGE plpgsql
AS $function$ BEGIN RETURN QUERY SELECT 'dummy-uuid'::uuid AS id, 0.0 AS similarity, 'dummy text' AS text; END; $function$
;


create schema if not exists "vecs";

create table "vecs"."valheim" (
    "id" character varying not null,
    "vec" vector(1536) not null,
    "metadata" jsonb not null default '{}'::jsonb
);


CREATE UNIQUE INDEX valheim_pkey ON vecs.valheim USING btree (id);

alter table "vecs"."valheim" add constraint "valheim_pkey" PRIMARY KEY using index "valheim_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION vecs.match_documents(namespace text, result_limit integer, vector vector)
 RETURNS TABLE(id character varying, similarity double precision, metadata jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  EXECUTE format('
    SELECT 
      id,  -- Cast id to varchar
      vec <=> $3 AS similarity,
      metadata
    FROM vecs.%I
    ORDER BY similarity
    LIMIT $2
  ', namespace)
  USING namespace, result_limit, vector;  -- note: $3 is `vector` here
END;
$function$
;

grant select on table "vecs"."valheim" to "anon";

grant select on table "vecs"."valheim" to "authenticated";

grant select on table "vecs"."valheim" to "service_role";


