# Prompt Optimizer V2

Uma ferramenta moderna para otimização de prompts com suporte a múltiplas LLMs e visualização em tempo real.

## Características

- 🎨 Interface moderna com tema azul e roxo
- 📊 Suporte a múltiplas LLMs
- 🔄 Visualização em tempo real das interações
- 💰 Análise de custos por LLM
- 🤖 Cliente simulado customizável
- 📈 Comparação antes/depois das otimizações

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Tiag8/prompt-optimizer-v2.git
cd prompt-optimizer-v2
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── theme/         # Configuração do tema
  ├── services/      # Serviços e APIs
  ├── utils/         # Utilitários
  └── context/       # Contextos React
```

## Configuração das LLMs

1. Acesse a página "API Config"
2. Adicione suas chaves de API para cada LLM
3. Configure os parâmetros desejados

## Desenvolvimento

Para contribuir com o projeto:

1. Crie um fork
2. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
3. Faça commit das mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## Licença

MIT