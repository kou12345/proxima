create or replace function match_documents_dot (
  query_embedding vector(384), -- インプット・パラメータ
  match_threshold float, -- スコアのフィルター条件
  match_count int -- 取得件数
)
returns table (
  id bigint,
  content text,
  similarity float -- スコア(類似度が高いと1に近づく)
)
language sql stable
as $$
  select
    embeddings.id,
    embeddings.content,
    (embeddings.embedding <#> query_embedding) * -1 as similarity -- スコア
  from embeddings
  where (embeddings.embedding <#> query_embedding) * -1 > match_threshold -- スコアのフィルター条件
  order by similarity desc -- スコアでソート
  limit match_count;
$$;
