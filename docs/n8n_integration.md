# n8n Integration: Scheduling via Chat

This document defines the payload structure for creating appointment cards in the UNIQ CRM Chat via n8n.

## Overview
n8n workflows should insert a record into the `crm_chat_mensagens` table in Supabase.

## Table Structure
**Table:** `crm_chat_mensagens`

| Column | Type | Value / Description |
| :--- | :--- | :--- |
| `conversa_id` | UUID | ID of the target conversation |
| `remetente_tipo` | Text | 'sistema' (or 'bot' if configured) |
| `conteudo` | Text | Fallback text (e.g., "Agendamento Criado") |
| `tipo_conteudo` | Text | **MUST BE 'agendamento'** |
| `metadados` | JSONB | Appointment Details (see below) |
| `lido` | Boolean | `false` |

## Webhook/Insert Payload (`metadados`)

The `metadados` JSON object drives the "Appointment Card" UI.

```json
{
  "status": "Confirmado",
  "data_agendamento": "2024-03-20T14:30:00.000Z",
  "nota": "Lavagem Completa + Polimento"
}
```

### Fields
- **status**: Status of the appointment (e.g., 'Pendente', 'Confirmado', 'Cancelado').
- **data_agendamento**: ISO 8601 Date String.
- **nota**: Optional description or service details.

> [!IMPORTANT]
> To trigger the **Appointment Card UI** in the chat, the `metadados` JSON object MUST be present. If `metadados` is null or invalid, it will render as a plain text message.

## Example SQL Insert
```sql
INSERT INTO crm_chat_mensagens (conversa_id, remetente_tipo, conteudo, tipo_conteudo, metadados)
VALUES (
  'uuid-da-conversa',
  'sistema',
  'Novo Agendamento',
  'agendamento',
  '{"status": "Pendente", "data_agendamento": "2024-03-25T10:00:00Z", "nota": "Avaliação Técnica"}'
);
```
