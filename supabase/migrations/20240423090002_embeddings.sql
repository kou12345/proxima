create extension if not exists vector with schema extensions;

create table embeddings (
  id bigint primary key generated always as identity,
  content text not null,
  embedding vector (384)
);

create index on embeddings using hnsw (embedding vector_ip_ops);
