create table "vecs"."bloodborne" (
    "id" character varying not null,
    "vec" vector(1536) not null,
    "metadata" jsonb not null default '{}'::jsonb
);


create table "vecs"."eldenring" (
    "id" character varying not null,
    "vec" vector(1536) not null,
    "metadata" jsonb not null default '{}'::jsonb
);


create table "vecs"."hollowknight" (
    "id" character varying not null,
    "vec" vector(1536) not null,
    "metadata" jsonb not null default '{}'::jsonb
);


CREATE UNIQUE INDEX bloodborne_pkey ON vecs.bloodborne USING btree (id);

CREATE UNIQUE INDEX eldenring_pkey ON vecs.eldenring USING btree (id);

CREATE UNIQUE INDEX hollowknight_pkey ON vecs.hollowknight USING btree (id);

alter table "vecs"."bloodborne" add constraint "bloodborne_pkey" PRIMARY KEY using index "bloodborne_pkey";

alter table "vecs"."eldenring" add constraint "eldenring_pkey" PRIMARY KEY using index "eldenring_pkey";

alter table "vecs"."hollowknight" add constraint "hollowknight_pkey" PRIMARY KEY using index "hollowknight_pkey";


