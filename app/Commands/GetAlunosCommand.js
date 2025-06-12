import axios from "axios";
import CliTable3 from "cli-table3";

export default {

    name: 'get-alunos',
    description: 'obter alunos',
    arguments: {
        seconds: "number",
    },

    handle: async function () {

        /**
         * No ./docker-compose.yml, nas linhas 55/56, dei o nome "web_host" para o host do container nginx.
         * Se você rodar o cli fora da rede do docker, você pode usar "localhost:8080" para acessar o nginx.
         * Caso contrário, voce deve chamar o nginx pelo nome do host do container na porta 80
         */
        const url = (process.env.IS_CONTAINER) ? ("http://web_host:80") : ("http://localhost:8080");

        console.log('URL do servidor:', url);

        /**
         * URLSearchParams é usado para gerenciar o request body dados no formato x-www-form-urlencoded.
         */
        const data = new URLSearchParams();
        data.append('email', 'user1@example.com'); 
        data.append('senha', '123456');         

        /**
         * Primeira etapa é fazer o login com o endpoint /login para obter o token JWT.
         */
        try {
            const response = await axios.post(`${url}/login`, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const tokenData = response.data;

            console.log('Token obtido:', tokenData.token);

            /**
             * Aqui devemos usar um loop para fazer várias requisições paginadas para /api/alunos
             */
            let limit = 10; 
            let offset = 0;
            let allAlunos = [];
            let hasMore = true;

            const table = new CliTable3({
                head: ['Nome', 'Matérias'], 
                colWidths: [30, 70]        
            });

            // Loop para buscar todos os alunos, paginando as requisições
            console.log('Iniciando a busca paginada de alunos...');
            while (hasMore) {
                try {
                    const alunosResponse = await axios.get(`${url}/api/alunos`, {
                        headers: {
                            'Authorization': `Bearer ${tokenData.token}`
                        },
                        params: {
                            offset: offset, 
                            limit: limit 
                        }
                    });

                    const responseData = alunosResponse.data;

                    if (responseData.rows && Array.isArray(responseData.rows)) {
                        allAlunos = allAlunos.concat(responseData.rows); 
                        console.log(`Página carregada. Total de alunos coletados até agora: ${allAlunos.length}`);

                        if (responseData.next && typeof responseData.next.offset === 'number') {
                            offset = responseData.next.offset; 
                        } else {
                            hasMore = false; 
                            console.log('Todas as páginas de alunos foram carregadas.');
                        }
                    } else {
                        console.warn('A resposta da API não contém um array de dados esperado ou a estrutura está incorreta (esperado "rows" como array).');
                        hasMore = false; 
                    }

                } catch (error) {
                    console.error(`Erro ao buscar alunos com offset ${offset}:`, error.response ? error.response.data : error.message);
                    hasMore = false; 
                }
            }

            if (allAlunos.length > 0) {
                allAlunos.forEach(aluno => {
                    const materiasFormatadas = aluno.materias
                        ? aluno.materias.map(materia => materia.nome).join(', ')
                        : 'N/A'; 

                    table.push([aluno.nome, materiasFormatadas]); 
                });

                console.log('\nTabela de Alunos e suas Matérias:');
                console.log(table.toString());
            } else {
                console.log('\nNenhum aluno encontrado para exibir.');
            }

        } catch (error) {
            console.error('Erro na requisição de login:', error.response?.data || error.message);
            console.error('Verifique se o servidor está rodando e as credenciais de login estão corretas (email: user1@example.com, senha: 123456).');
            return;
        }

        console.log('Comando "get-alunos" finalizado.');
    }
}