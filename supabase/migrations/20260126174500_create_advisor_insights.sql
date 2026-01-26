-- Create Enums for strict typing
do $$ begin
    create type insight_type as enum ('CHURN_RISK', 'STUCK_DEAL', 'RELATIONSHIP');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type insight_status as enum ('PENDING', 'SENT', 'DISMISSED', 'COMPLETED');
exception
    when duplicate_object then null;
end $$;

-- Create the Insights Table
create table if not exists advisor_insights (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null, -- Linked to the Company/Tenant, not the specific User
  type insight_type not null,
  status insight_status default 'PENDING'::insight_status,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS for security
alter table advisor_insights enable row level security;

-- Policy: Users can view their COMPANY'S insights
-- Requires a lookup in me_usuario table to match the auth.uid() to the empresa_id
create policy "Users can view company insights"
  on advisor_insights for select
  using (
    empresa_id in (
      select empresa_id from me_usuario where id = auth.uid()
    )
  );

-- Policy: Users can update their COMPANY'S insights
create policy "Users can update company insights"
  on advisor_insights for update
  using (
    empresa_id in (
      select empresa_id from me_usuario where id = auth.uid()
    )
  );
