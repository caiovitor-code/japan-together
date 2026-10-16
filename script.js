const botao = document.getElementById("botao-sonho");
const mensagem = document.getElementById("mensagem");

let primeiraMensagem = true;

botao.addEventListener("click", function() {
    if (primeiraMensagem) {
        mensagem.textContent = "Nosso sonho de morar no Japão começa aqui!";
        primeiraMensagem = false;
    } else {
        mensagem.textContent = "Um passo por vez, e chegaremos lá!";
        primeiraMensagem = true;
    }
});

const contador = document.getElementById("contador");
const botaoProgresso = document.getElementById("botao-progresso");
const avisoProgresso = document.getElementById("aviso-progresso");
const botaoReset = document.getElementById("botao-reset");
const barraPreenchimento = document.getElementById("barra-preenchimento");

// Recupera o progresso salvo no navegador
let etapasConcluidas = Number(localStorage.getItem("etapasConcluidas")) || 0;
function atualizarBarra() {
    const porcentagem = (etapasConcluidas / 5) * 100;
    barraPreenchimento.style.width = porcentagem + "%";
}

// Garante que o número exibido corresponda ao valor recuperado
contador.textContent = etapasConcluidas;

// Restaura a mensagem se a meta já foi concluída
if (etapasConcluidas >= 5) {
    avisoProgresso.textContent = "Parabéns! Meta de 5 etapas concluída!";
}

// Botão para concluir etapas

if (botaoProgresso) {
    botaoProgresso.addEventListener("click", function() {
        if (etapasConcluidas < 5) {
            etapasConcluidas = etapasConcluidas + 1;
            contador.textContent = etapasConcluidas;
            atualizarBarra();

            localStorage.setItem("etapasConcluidas", etapasConcluidas);
        }

        if (etapasConcluidas === 5) {
            avisoProgresso.textContent =
                "Parabéns! Meta de 5 etapas concluída!";
        } else {
            avisoProgresso.textContent = "";
        }
    });
}

if (botaoReset) {
    botaoReset.addEventListener("click", function() {
        etapasConcluidas = 0;
        contador.textContent = etapasConcluidas;

        atualizarBarra();

        localStorage.removeItem("etapasConcluidas");

        avisoProgresso.textContent = "";
    });
}

const metaFinanceira = document.getElementById("meta-financeira");
const valorEconomizado = document.getElementById("valor-economizado");

const resultadoMeta = document.getElementById("resultado-meta");
const resultadoEconomizado = document.getElementById("resultado-economizado");
const resultadoFalta = document.getElementById("resultado-falta");
const resultadoPorcentagem = document.getElementById("resultado-porcentagem");
const barraFinanceiraPreenchimento = document.getElementById("barra-financeira-preenchimento");
metaFinanceira.value = localStorage.getItem("metaFinanceira") || "";
valorEconomizado.value = localStorage.getItem("valorEconomizado") || "";

function calcularFinanceiro() {
    const meta = Number(metaFinanceira.value) || 0;
    const economizado = Number(valorEconomizado.value) || 0;
    const falta = Math.max(meta - economizado, 0);  
const mensagemFinanceira = document.getElementById("mensagem-financeira");

mensagemFinanceira.classList.remove(
    "meta-atingida",
    "meta-ultrapassada"
);
if (meta <= 0) {
    mensagemFinanceira.textContent = "";
} else if (economizado < meta) {
    mensagemFinanceira.textContent =
        "Vamos continuar! Faltam " +
        falta.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        }) +
        " para alcançar nossa meta.";
} else if (economizado === meta) {
    mensagemFinanceira.textContent =
        "Parabéns! Vocês atingiram exatamente a meta financeira!";
        mensagemFinanceira.classList.add("meta-atingida");
} else {
    const excedente = economizado - meta;

    mensagemFinanceira.textContent =
        "Parabéns! Vocês economizaram " +
        excedente.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        }) +
        " além da meta!";
        mensagemFinanceira.classList.add("meta-ultrapassada");
}

    const porcentagem = meta > 0
        ? Math.min((economizado / meta) * 100, 100)
        : 0;
barraFinanceiraPreenchimento.style.width = porcentagem + "%";
    resultadoMeta.textContent = meta.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    resultadoEconomizado.textContent = economizado.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    resultadoFalta.textContent = falta.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    resultadoPorcentagem.textContent = porcentagem.toFixed(1) + "%";
    atualizarDashboard();
}


metaFinanceira.addEventListener("input", function() {
    localStorage.setItem("metaFinanceira", metaFinanceira.value);
    calcularFinanceiro();
});

valorEconomizado.addEventListener("input", function() {
    localStorage.setItem("valorEconomizado", valorEconomizado.value);
    calcularFinanceiro();
});

calcularFinanceiro();

const valorContribuicao = document.getElementById("valor-contribuicao");
const descricaoContribuicao = document.getElementById("descricao-contribuicao");
const tipoMovimentacao = document.getElementById("tipo-movimentacao");
const botaoAdicionarContribuicao = document.getElementById("botao-adicionar-contribuicao");
const listaContribuicoes = document.getElementById("lista-contribuicoes");
const saldoHistorico = document.getElementById("saldo-historico");

// Recupera o histórico salvo
let contribuicoes = JSON.parse(
    localStorage.getItem("historicoContribuicoes")
) || [];

// Converte registros antigos para o novo formato
contribuicoes = contribuicoes.map(function(item) {
    return {
        valor: Number(item.valor) || 0,
        descricao: item.descricao || "Contribuição anterior",
        tipo: item.tipo === "retirada" ? "retirada" : "entrada",
        data: item.data || new Date().toISOString()
    };
});

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Calcula o saldo usando todas as movimentações
function calcularSaldoHistorico() {
    return contribuicoes.reduce(function(saldo, item) {
        if (item.tipo === "retirada") {
            return saldo - item.valor;
        }

        return saldo + item.valor;
    }, 0);
}

// Atualiza o valor economizado e o painel financeiro
function atualizarSaldoFinanceiro() {
    const saldo = calcularSaldoHistorico();
    const saldoSeguro = Math.max(saldo, 0);

    valorEconomizado.value = saldoSeguro.toFixed(2);

    localStorage.setItem("valorEconomizado", saldoSeguro.toFixed(2));

    calcularFinanceiro();

    saldoHistorico.textContent =
        "Saldo do histórico: " + formatarMoeda(saldoSeguro);

    const indicadorSaldo = document.getElementById("saldo-atual-grafico");

    if (indicadorSaldo) {
        indicadorSaldo.textContent = formatarMoeda(saldoSeguro);
    }
}

// Exibe o histórico na página
function mostrarContribuicoes() {
    listaContribuicoes.innerHTML = "";

    if (contribuicoes.length === 0) {
        listaContribuicoes.textContent =
            "Nenhuma movimentação registrada ainda.";
    } else {
        contribuicoes.forEach(function(item) {
            const linha = document.createElement("div");
            const descricao = document.createElement("p");
            const valor = document.createElement("strong");

            descricao.textContent =
                (item.tipo === "retirada" ? "Retirada: " : "Entrada: ") +
                item.descricao;

            valor.textContent =
                (item.tipo === "retirada" ? "− " : "+ ") +
                formatarMoeda(item.valor);

            valor.style.color =
                item.tipo === "retirada" ? "#C74738" : "#287A46";

            linha.appendChild(descricao);
            linha.appendChild(valor);
            listaContribuicoes.appendChild(linha);
        });
    }

    atualizarSaldoFinanceiro();
    desenharGraficoFinanceiro();
}

// Registra entradas e retiradas
botaoAdicionarContribuicao.addEventListener("click", function() {
    const valor = Number(valorContribuicao.value);
    const descricao = descricaoContribuicao.value.trim();
    const tipo = tipoMovimentacao.value;

    if (!Number.isFinite(valor) || valor <= 0) {
        alert("Digite um valor maior que zero.");
        return;
    }

    if (descricao === "") {
        alert("Digite uma descrição para a movimentação.");
        return;
    }

    const saldoAtual = calcularSaldoHistorico();

    if (tipo === "retirada" && valor > saldoAtual) {
        alert("A retirada não pode ser maior que o saldo disponível.");
        return;
    }

    contribuicoes.push({
        valor: valor,
        descricao: descricao,
        tipo: tipo,
        data: new Date().toISOString()
    });

    localStorage.setItem(
        "historicoContribuicoes",
        JSON.stringify(contribuicoes)
    );

    mostrarContribuicoes();

    valorContribuicao.value = "";
    descricaoContribuicao.value = "";
});

// Mostra os registros salvos ao abrir a página
mostrarContribuicoes();

const botaoMenu = document.getElementById("botao-menu");
const menuNavegacao = document.getElementById("menu-navegacao");
const botoesNavegacao = document.querySelectorAll(".botao-navegacao");
const secoes = document.querySelectorAll("main .secao");

// Abre e fecha o menu
botaoMenu.addEventListener("click", function() {
    const menuEstaFechado = menuNavegacao.hidden;

    menuNavegacao.hidden = !menuEstaFechado;
    botaoMenu.setAttribute("aria-expanded", String(menuEstaFechado));
    botaoMenu.setAttribute(
        "aria-label",
        menuEstaFechado ? "Fechar menu" : "Abrir menu"
    );
});

// Troca a seção selecionada
botoesNavegacao.forEach(function(botao) {
    botao.addEventListener("click", function() {
        const idSecao = botao.dataset.secao;

        secoes.forEach(function(secao) {
            secao.hidden = secao.id !== idSecao;
        });

         if (idSecao === "financeiro") {
            desenharGraficoFinanceiro();
        }

        botoesNavegacao.forEach(function(outroBotao) {
            outroBotao.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        menuNavegacao.hidden = true;
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");

        window.scrollTo(0, 0);
    });
});

const botaoLimparHistorico = document.getElementById("botao-limpar-historico");

botaoLimparHistorico.addEventListener("click", function() {
    const confirmar = confirm(
        "Tem certeza que deseja apagar todo o histórico de movimentações? Essa ação não pode ser desfeita."
    );

    if (!confirmar) {
        return;
    }

    contribuicoes = [];

    localStorage.removeItem("historicoContribuicoes");

    mostrarContribuicoes();
});

/* ===== CHECKLIST DO PLANEJAMENTO ===== */

const tarefasPlanejamento = document.querySelectorAll(
    ".tarefa-planejamento"
);

const totalTarefas = document.getElementById("total-tarefas");

// Recupera as tarefas marcadas anteriormente
let tarefasSalvas = {};

try {
    tarefasSalvas = JSON.parse(
        localStorage.getItem("tarefasPlanejamento")
    ) || {};
} catch (erro) {
    tarefasSalvas = {};
}

// Atualiza contador, barra e mensagem
function atualizarProgressoPlanejamento() {
    const total = tarefasPlanejamento.length;

    let concluidas = 0;

    tarefasPlanejamento.forEach(function(tarefa) {
        if (tarefa.checked) {
            concluidas++;
        }
    });

    const porcentagem = total > 0
        ? (concluidas / total) * 100
        : 0;

    contador.textContent = concluidas;
    totalTarefas.textContent = total;
    barraPreenchimento.style.width = porcentagem + "%";

    if (concluidas === total && total > 0) {
        avisoProgresso.textContent =
            "Parabéns! Todas as tarefas do planejamento foram concluídas!";
    } else {
        avisoProgresso.textContent =
            "Você concluiu " + concluidas + " de " + total +
            " tarefas (" + Math.round(porcentagem) + "%).";
    }

    // Mantém o contador salvo para compatibilidade com o código antigo
    localStorage.setItem("etapasConcluidas", concluidas);
}

// Restaura as marcações salvas
tarefasPlanejamento.forEach(function(tarefa) {
    tarefa.checked = tarefasSalvas[tarefa.dataset.id] === true;

    tarefa.addEventListener("change", function() {
        tarefasSalvas[tarefa.dataset.id] = tarefa.checked;

        localStorage.setItem(
            "tarefasPlanejamento",
            JSON.stringify(tarefasSalvas)
        );

        atualizarProgressoPlanejamento();
        atualizarDashboard();
    });
});

// Calcula o progresso assim que a página abre
atualizarProgressoPlanejamento();

/* ===== MISSÃO 19.2: DADOS DO DASHBOARD ===== */

function atualizarDashboard() {
    // Busca os elementos do dashboard
    const dashboardEconomizado =
        document.getElementById("dashboard-economizado");

    const dashboardMeta =
        document.getElementById("dashboard-meta");

    const dashboardTarefas =
        document.getElementById("dashboard-tarefas");

    const dashboardBarraTarefas =
        document.getElementById("dashboard-barra-tarefas");

    const dashboardPercentual =
        document.getElementById("dashboard-percentual");

    // Recupera os valores financeiros salvos
    const economizado =
        Number(localStorage.getItem("valorEconomizado")) || 0;

    const meta =
        Number(localStorage.getItem("metaFinanceira")) || 0;

    // Conta as tarefas concluídas
    const tarefas = document.querySelectorAll(
        ".tarefa-planejamento"
    );

    let concluidas = 0;

    tarefas.forEach(function(tarefa) {
        if (tarefa.checked) {
            concluidas++;
        }
    });

    const total = tarefas.length;

    const percentual = total > 0
        ? Math.round((concluidas / total) * 100)
        : 0;
         // Calcula o progresso financeiro, limitado a 100%
    const progressoFinanceiro = meta > 0
        ? Math.min(100, Math.max(0, (economizado / meta) * 100))
        : 0;

    // Combina o progresso financeiro com as tarefas
    const progressoGeral = Math.round(
        (progressoFinanceiro + percentual) / 2
    );

    // Formata os valores como moeda brasileira
    const moeda = function(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

    // Atualiza os cartões
    dashboardEconomizado.textContent = moeda(economizado);
    dashboardMeta.textContent = moeda(meta);
    
    // Calcula quanto falta para alcançar a meta
    const dashboardFalta =
        document.getElementById("dashboard-falta");

    const falta = Math.max(0, meta - economizado);

    if (dashboardFalta) {
        dashboardFalta.textContent = moeda(falta);
    }

    dashboardTarefas.textContent =
        concluidas + " / " + total;

    dashboardBarraTarefas.style.width =
        percentual + "%";

    dashboardPercentual.textContent =
        percentual + "% concluído";
        
    // Atualiza o indicador geral da jornada
    const indicadorProgressoGeral =
        document.getElementById("dashboard-progresso-geral");

    const barraProgressoGeral =
        document.getElementById("dashboard-barra-geral");

    if (indicadorProgressoGeral) {
        indicadorProgressoGeral.textContent =
            progressoGeral + "%";
    }

    if (barraProgressoGeral) {
        barraProgressoGeral.style.width =
            progressoGeral + "%";
    }

        
    // Atualiza a mensagem da nossa jornada
    const mensagemGeral =
        document.getElementById("dashboard-mensagem-geral");
    if (mensagemGeral) {
        if (progressoFinanceiro >= 100) {
            mensagemGeral.textContent =
                "Meta financeira alcançada! Próxima etapa da jornada!";
        } else if (progressoFinanceiro > 0 || concluidas > 0) {
            mensagemGeral.textContent =
                "Estamos avançando rumo ao Japão!";
        } else {
            mensagemGeral.textContent =
                "Toda grande mudança começa com o primeiro passo!";
        }
    }
}

// Atualiza o dashboard ao abrir a página
atualizarDashboard();

function desenharGraficoFinanceiro() {
    const canvas = document.getElementById("grafico-financeiro");
    const mensagem = document.getElementById("mensagem-grafico");

    if (!canvas || !mensagem) {
        return;
    }

    const contexto = canvas.getContext("2d");

 const largura = canvas.parentElement.clientWidth;
const altura = canvas.getBoundingClientRect().height;

    // Se a seção estiver escondida, desenharemos ao abri-la.
    if (largura === 0 || altura === 0) {
        return;
    }
    canvas.width = canvas.parentElement.clientWidth;
canvas.height = altura;

    contexto.clearRect(0, 0, largura, altura);

    const movimentosOrdenados = [...contribuicoes].sort(
        function(a, b) {
            return new Date(a.data) - new Date(b.data);
        }
    );

    if (movimentosOrdenados.length === 0) {
        mensagem.textContent =
            "Registre uma movimentação para visualizar o gráfico.";
        return;
    }

    // Começamos com saldo zero e calculamos cada movimentação.
    let saldo = 0;

    const pontos = [{ saldo: 0, data: null }];

    movimentosOrdenados.forEach(function(item) {
        if (item.tipo === "retirada") {
            saldo -= item.valor;
        } else {
            saldo += item.valor;
        }
       pontos.push({ saldo: saldo, data: item.data });
    });

    const valores = pontos.map(function(ponto) {
        return ponto.saldo;
    });

    let minimo = Math.min(...valores);
    let maximo = Math.max(...valores);

    if (minimo === maximo) {
        maximo += 1;
        minimo -= 1;
    }

    const margem = {
        superior: 20,
        inferior: 35,
        esquerda: 55,
        direita: 45
    };

    const larguraUtil =
        largura - margem.esquerda - margem.direita;

    const alturaUtil =
        altura - margem.superior - margem.inferior;

    function formatarValor(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0
        });
    }

    // Desenhamos as linhas horizontais de referência.
    contexto.font = "11px Arial";
    contexto.textAlign = "right";
    contexto.textBaseline = "middle";
    contexto.strokeStyle = "#E2E8F0";
    contexto.fillStyle = "#64748B";
    contexto.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
        const valor = maximo - (maximo - minimo) * (i / 4);

        const y =
            margem.superior + alturaUtil * (i / 4);

        contexto.beginPath();
        contexto.moveTo(margem.esquerda, y);
        contexto.lineTo(largura - margem.direita, y);
        contexto.stroke();

        contexto.fillText(
            formatarValor(valor),
            margem.esquerda - 8,
            y
        );
    }

    // Transformamos cada saldo em uma posição no gráfico.
    const coordenadas = pontos.map(function(ponto, indice) {
        const x =
            margem.esquerda +
            (indice / (pontos.length - 1)) * larguraUtil;
        const y =
            margem.superior +
            ((maximo - ponto.saldo) / (maximo - minimo)) *
            alturaUtil;
        return { x: x, y: y };
    });
    
    // Desenhar as datas no eixo horizontal
    contexto.font = "11px Arial";
    contexto.fillStyle = "#64748B";
    contexto.textAlign = "center";
    contexto.textBaseline = "top";

    const intervaloDatas = Math.max(
        1,
        Math.ceil((pontos.length - 1) / 6)
    );

    for (let i = 0; i < pontos.length; i++) {
        // Mostrar no máximo cerca de 7 datas, incluindo a última
        if (
            i !== 0 &&
            i !== pontos.length - 1 &&
            i % intervaloDatas !== 0
        ) {
            continue;
        }

        let textoData = "Início";

        if (pontos[i].data) {
            textoData = new Date(pontos[i].data).toLocaleDateString(
                "pt-BR",
                {
                    day: "2-digit",
                    month: "2-digit"
                }
            );
        }

        contexto.fillText(
            textoData,
            coordenadas[i].x,
            altura - margem.inferior + 10
        );
    }
    // Ligamos os pontos para formar a linha do saldo.
    contexto.beginPath();
    contexto.strokeStyle = "#287A46";
    contexto.lineWidth = 3;
    contexto.lineJoin = "round";
    contexto.lineCap = "round";

    coordenadas.forEach(function(ponto, indice) {
        if (indice === 0) {
            contexto.moveTo(ponto.x, ponto.y);
        } else {
            contexto.lineTo(ponto.x, ponto.y);
        }
    });

    contexto.stroke();
    // Desenhar os marcadores das movimentações
coordenadas.forEach(function(ponto, indice) {
    const ultimoPonto = indice === coordenadas.length - 1;

    contexto.beginPath();
    contexto.arc(
        ponto.x,
        ponto.y,
        ultimoPonto ? 6 : 4,
        0,
        Math.PI * 2
    );

    contexto.fillStyle = ultimoPonto ? "#C74738" : "#287A46";
    contexto.fill();

    contexto.lineWidth = 2;
    contexto.strokeStyle = "#FFFFFF";
    contexto.stroke();
});

    // Marcamos cada saldo com um círculo.
    coordenadas.forEach(function(ponto) {
        contexto.beginPath();
        contexto.arc(ponto.x, ponto.y, 4, 0, Math.PI * 2);
        contexto.fillStyle = "#287A46";
        contexto.fill();
    });

    mensagem.textContent =
        movimentosOrdenados.length +
        (movimentosOrdenados.length === 1
            ? " movimentação registrada. "
            : " movimentações registradas. ") +
        "Saldo do histórico: " + formatarValor(saldo) + ".";
}