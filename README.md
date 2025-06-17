# Firebase Studio

Este é um projeto inicial com NextJS no Firebase Studio. Usando o Gemini AI para auxiliar na construção do projeto.

Para começar, dê uma olhada em src/app/page.tsx.

## Rodando o servidor

Para rodar o servidor de desenvolvimento:

```bash
npm run dev
```

Isso iniciará o app, geralmente na porta 9002. Abra [http://localhost:9002](http://localhost:9002) no seu navegador.


## Acessando no celular

Você pode acessar o servidor de desenvolvimento em execução a partir de um dispositivo móvel na mesma rede:

1.  **Encontre o endereço IP local do seu computador:**
    *   **Windows:** Abra o Prompt de Comando (`cmd`) e digite `ipconfig`. Procure o endereço IPv4 do adaptador de rede ativo (por exemplo, Wi-Fi ou Ethernet).
2.  **Conecte seu dispositivo móvel:** Certifique-se de que seu celular ou tablet está conectado à mesma rede Wi-Fi que o seu computador.
3.  **Abra seu navegador:** No seu dispositivo móvel, abra um navegador e acesse `http://<your_computer_ip>:9002` (substitua `<your_computer_ip>` pelo endereço IP que você encontrou).
4.  **Firewall:** Se não conseguir se conectar, verifique se o firewall do seu computador está bloqueando conexões na porta 9002. Pode ser necessário criar uma regra permitindo tráfego nessa porta.

## Deployment

Se o aplicativo for implantado em um provedor de hospedagem (como Firebase Hosting, Vercel, Netlify, etc.), você poderá acessá-lo no celular simplesmente navegando até sua URL pública no navegador do dispositivo móvel.
