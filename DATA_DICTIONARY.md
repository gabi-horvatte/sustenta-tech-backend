# SustentaTech - Dicionário de Dados

## 📋 Visão Geral

Este documento apresenta o dicionário de dados completo da plataforma **SustentaTech**, uma aplicação educacional voltada para sustentabilidade e educação ambiental. O sistema utiliza PostgreSQL como banco de dados relacional e segue os princípios de normalização e integridade referencial.

---

## 🏗️ Arquitetura do Banco de Dados

### Características Técnicas
- **SGBD**: PostgreSQL
- **Padrão de IDs**: UUID (Universally Unique Identifier)
- **Timestamps**: Automáticos com `CURRENT_TIMESTAMP`
- **Integridade**: Foreign Keys com CASCADE
- **Indexação**: Índices otimizados para consultas frequentes

### Estrutura Modular
O banco de dados está organizado em módulos funcionais:
- **Autenticação e Autorização** (IAM)
- **Gestão de Turmas e Usuários**
- **Atividades Educativas e Avaliações**
- **Materiais Didáticos**
- **Sistema de Notificações**

---

## 📊 Tabelas e Relacionamentos

### 1. **account** - Contas de Usuário
Tabela central que armazena informações básicas de todos os usuários do sistema.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único do usuário |
| `name` | VARCHAR(255) | NOT NULL | Primeiro nome do usuário |
| `last_name` | VARCHAR(255) | NOT NULL | Sobrenome do usuário |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email único para login |
| `password` | VARCHAR(255) | NOT NULL | Senha criptografada (hash) |
| `phone` | VARCHAR(255) | NOT NULL | Número de telefone |
| `birth_date` | DATE | NOT NULL | Data de nascimento |
| `role` | TEXT | NOT NULL | Tipo de usuário: 'STUDENT' ou 'TEACHER' |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Email deve ser único no sistema
- Role define o tipo de acesso (STUDENT/TEACHER)
- Password armazenada com hash seguro
- Campos obrigatórios para cadastro completo

---

### 2. **classroom** - Turmas
Representa as salas de aula virtuais onde professores organizam alunos.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único da turma |
| `name` | VARCHAR(255) | NOT NULL | Nome da turma |
| `description` | TEXT | NOT NULL | Descrição detalhada da turma |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Uma turma pode ter múltiplos alunos
- Uma turma pode ter múltiplos professores
- Nome e descrição são obrigatórios

---

### 3. **teacher** - Professores
Especialização da tabela account para usuários do tipo professor.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, REFERENCES account(id) ON DELETE CASCADE | ID do professor (mesmo da account) |
| `manager` | BOOLEAN | NOT NULL, DEFAULT FALSE | Indica se é um professor gestor |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Herda informações básicas da tabela account
- Manager indica privilégios administrativos
- Exclusão em cascata com account

---

### 4. **student** - Alunos
Especialização da tabela account para usuários do tipo aluno.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, REFERENCES account(id) ON DELETE CASCADE | ID do aluno (mesmo da account) |
| `classroom_id` | TEXT | NOT NULL, REFERENCES classroom(id) | Turma à qual o aluno pertence |
| `code` | VARCHAR(255) | NOT NULL, UNIQUE | Código único do aluno |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Cada aluno pertence a uma única turma
- Code é único para identificação rápida
- Exclusão em cascata com account e classroom

---

### 5. **classroom_teacher** - Associação Professor-Turma
Tabela de relacionamento N:N entre professores e turmas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `classroom_id` | TEXT | NOT NULL, REFERENCES classroom(id) ON DELETE CASCADE | ID da turma |
| `teacher_id` | TEXT | NOT NULL, REFERENCES teacher(id) ON DELETE CASCADE | ID do professor |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de associação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Um professor pode lecionar em múltiplas turmas
- Uma turma pode ter múltiplos professores
- Exclusão em cascata com classroom e teacher

---

### 6. **activity_template** - Modelos de Atividade
Templates reutilizáveis para criação de atividades educativas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único do template |
| `name` | VARCHAR(255) | NOT NULL | Nome do template |
| `description` | TEXT | NOT NULL | Descrição da atividade |
| `created_by` | TEXT | NOT NULL, REFERENCES teacher(id) | Professor criador |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Templates são reutilizáveis para múltiplas atividades
- Apenas professores podem criar templates
- Nome e descrição obrigatórios

---

### 7. **question** - Questões
Questões que compõem os templates de atividade.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único da questão |
| `activity_template_id` | TEXT | NOT NULL, REFERENCES activity_template(id) ON DELETE CASCADE | Template ao qual pertence |
| `question_text` | TEXT | NOT NULL | Texto da pergunta |
| `question_order` | INTEGER | NOT NULL | Ordem da questão no template |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Cada questão pertence a um template
- Order define a sequência de apresentação
- Exclusão em cascata com activity_template

**Índices:**
- `idx_question_activity_template` ON (activity_template_id)

---

### 8. **question_option** - Opções de Resposta
Alternativas de resposta para questões de múltipla escolha.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único da opção |
| `question_id` | TEXT | NOT NULL, REFERENCES question(id) ON DELETE CASCADE | Questão à qual pertence |
| `option_text` | TEXT | NOT NULL | Texto da opção |
| `is_correct` | BOOLEAN | NOT NULL, DEFAULT FALSE | Indica se é a resposta correta |
| `option_order` | INTEGER | NOT NULL | Ordem de apresentação |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Cada questão deve ter múltiplas opções
- Apenas uma opção pode ser correta por questão
- Order define a sequência de apresentação

**Índices:**
- `idx_question_option_question` ON (question_id)

---

### 9. **activity** - Atividades
Instâncias específicas de atividades atribuídas a turmas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único da atividade |
| `name` | VARCHAR(255) | NOT NULL | Nome da atividade |
| `description` | TEXT | NOT NULL | Descrição da atividade |
| `classroom_id` | TEXT | NOT NULL, REFERENCES classroom(id) | Turma destinatária |
| `teacher_id` | TEXT | NOT NULL, REFERENCES teacher(id) | Professor responsável |
| `activity_template_id` | TEXT | NOT NULL, REFERENCES activity_template(id) ON DELETE CASCADE | Template utilizado |
| `expires_at` | TIMESTAMP | NOT NULL | Data limite para conclusão |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Baseada em um template específico
- Atribuída a uma turma específica
- Possui data limite para conclusão
- Criada por um professor

---

### 10. **activity_student** - Participação em Atividades
Relacionamento entre alunos e atividades, rastreando conclusão.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `activity_id` | TEXT | NOT NULL, REFERENCES activity(id) | ID da atividade |
| `student_id` | TEXT | NOT NULL, REFERENCES student(id) | ID do aluno |
| `completed_at` | TIMESTAMP | NULL | Data de conclusão (NULL = não concluída) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de atribuição |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Rastreia quais alunos completaram quais atividades
- completed_at NULL indica atividade pendente
- Criado automaticamente quando atividade é atribuída

---

### 11. **student_answer** - Respostas dos Alunos
Armazena as respostas dos alunos às questões das atividades.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único da resposta |
| `activity_id` | TEXT | NOT NULL, REFERENCES activity(id) ON DELETE CASCADE | Atividade respondida |
| `student_id` | TEXT | NOT NULL, REFERENCES student(id) ON DELETE CASCADE | Aluno que respondeu |
| `question_id` | TEXT | NOT NULL, REFERENCES question(id) ON DELETE CASCADE | Questão respondida |
| `selected_option_id` | TEXT | REFERENCES question_option(id) ON DELETE CASCADE | Opção selecionada |
| `is_correct` | BOOLEAN | NOT NULL | Indica se a resposta está correta |
| `answered_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data/hora da resposta |

**Restrições:**
- UNIQUE(activity_id, student_id, question_id) - Uma resposta por questão por aluno

**Regras de Negócio:**
- Cada aluno pode responder cada questão apenas uma vez
- selected_option_id pode ser NULL (questão não respondida)
- is_correct calculado automaticamente

**Índices:**
- `idx_student_answer_activity` ON (activity_id)
- `idx_student_answer_student` ON (student_id)

---

### 12. **material_template** - Modelos de Material
Templates para materiais educativos reutilizáveis.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único do template |
| `name` | VARCHAR(255) | NOT NULL | Nome do material |
| `description` | TEXT | NOT NULL | Descrição do conteúdo |
| `authors` | TEXT | NOT NULL | Autores do material |
| `url` | TEXT | NOT NULL | Link para o recurso |
| `thumbnail` | TEXT | NULL | URL da imagem de capa |
| `material_type` | VARCHAR(50) | NOT NULL, DEFAULT 'video' | Tipo: video, pdf, link, etc. |
| `created_by` | TEXT | NOT NULL, REFERENCES teacher(id) | Professor criador |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Templates reutilizáveis para múltiplas atribuições
- Suporte a diferentes tipos de mídia
- URL obrigatória para acesso ao conteúdo

---

### 13. **material_assignment** - Atribuições de Material
Instâncias específicas de materiais atribuídos a turmas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único da atribuição |
| `material_template_id` | TEXT | NOT NULL, REFERENCES material_template(id) ON DELETE CASCADE | Template utilizado |
| `classroom_id` | TEXT | NOT NULL, REFERENCES classroom(id) ON DELETE CASCADE | Turma destinatária |
| `assigned_by` | TEXT | NOT NULL, REFERENCES teacher(id) | Professor responsável |
| `expires_at` | TIMESTAMP | NOT NULL | Data limite para estudo |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de atribuição |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- Baseada em um template específico
- Atribuída a uma turma específica
- Possui data limite para conclusão

---

### 14. **material_completion** - Conclusão de Materiais
Rastreia quais alunos completaram quais materiais.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único |
| `material_assignment_id` | TEXT | NOT NULL, REFERENCES material_assignment(id) ON DELETE CASCADE | Atribuição de material |
| `student_id` | TEXT | NOT NULL, REFERENCES student(id) ON DELETE CASCADE | Aluno que completou |
| `completed_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de conclusão |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Restrições:**
- UNIQUE(material_assignment_id, student_id) - Uma conclusão por material por aluno

**Regras de Negócio:**
- Registra quando um aluno marca material como estudado
- Usado para relatórios de progresso

---

### 15. **notification** - Notificações
Sistema de notificações para comunicação entre usuários.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | TEXT | PRIMARY KEY | Identificador único da notificação |
| `account_id` | TEXT | NOT NULL, REFERENCES account(id) | Destinatário da notificação |
| `message` | TEXT | NOT NULL | Conteúdo da mensagem |
| `url` | TEXT | NULL | Link relacionado (opcional) |
| `creation_reason` | TEXT | NOT NULL | Motivo da criação |
| `created_by` | TEXT | NOT NULL, REFERENCES account(id) | Criador da notificação |
| `read_at` | TIMESTAMP | NULL | Data de leitura (NULL = não lida) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Regras de Negócio:**
- read_at NULL indica notificação não lida
- creation_reason categoriza o tipo de notificação
- URL opcional para redirecionamento

**Índices:**
- `idx_notification_read_at` ON (read_at)
- `idx_notification_created_at` ON (created_at)
- `idx_notification_updated_at` ON (updated_at)
- `idx_notification_creation_reason` ON (creation_reason)

---

## 🔗 Relacionamentos Principais

### Hierarquia de Usuários
```
account (1) ←→ (1) teacher
account (1) ←→ (1) student
```

### Estrutura Educacional
```
classroom (1) ←→ (N) student
classroom (N) ←→ (N) teacher (via classroom_teacher)
```

### Atividades e Avaliações
```
teacher (1) ←→ (N) activity_template
activity_template (1) ←→ (N) question
question (1) ←→ (N) question_option
activity_template (1) ←→ (N) activity
activity (N) ←→ (N) student (via activity_student)
activity + student + question ←→ student_answer
```

### Materiais Educativos
```
teacher (1) ←→ (N) material_template
material_template (1) ←→ (N) material_assignment
material_assignment (N) ←→ (N) student (via material_completion)
```

### Sistema de Notificações
```
account (1) ←→ (N) notification (como destinatário)
account (1) ←→ (N) notification (como criador)
```

---

## 📈 Métricas e Analytics

### Dados Coletados para Relatórios
- **Progresso dos Alunos**: Atividades concluídas, pontuações, tempo de resposta
- **Efetividade das Atividades**: Taxa de conclusão, dificuldade das questões
- **Engajamento com Materiais**: Materiais estudados, tempo de acesso
- **Performance das Turmas**: Comparativos entre turmas e períodos

### Consultas Otimizadas
- Índices estratégicos para consultas frequentes
- Relacionamentos eficientes para relatórios complexos
- Estrutura preparada para análises temporais

---

## 🔒 Segurança e Integridade

### Integridade Referencial
- Foreign Keys com CASCADE apropriado
- Constraints UNIQUE onde necessário
- Validações de domínio nos campos

### Auditoria
- Timestamps automáticos em todas as tabelas
- Rastreamento de criação e modificação
- Histórico de ações dos usuários

### Escalabilidade
- UUIDs para identificadores únicos
- Estrutura modular para crescimento
- Índices otimizados para performance

---

## 📋 Resumo Estatístico

| Categoria | Quantidade |
|-----------|------------|
| **Tabelas Principais** | 15 |
| **Relacionamentos N:N** | 3 |
| **Índices Customizados** | 8 |
| **Foreign Keys** | 20+ |
| **Campos com UNIQUE** | 4 |
| **Tabelas com Soft Delete** | 0 (Hard delete com CASCADE) |

---

*Este dicionário de dados representa a estrutura completa do banco de dados SustentaTech, projetado para suportar uma plataforma educacional robusta e escalável focada em sustentabilidade e educação ambiental.*
