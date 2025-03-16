'use strict';

// DECLARAÇÃO DE VARIÁVEIS DOM
const divAlerta = document.getElementById('alerta');
const btnInserir = document.getElementById('botaoInserir');
const btnCompartilhar = document.getElementById('botaoCompartilhar'); // Botão Compartilhar
const descricaoItem = document.getElementById('inputDescricao');
const quantidadeItem = document.getElementById('inputQuantidade');
const precoItem = document.getElementById('inputPreco');
const tabelaTbody = document.getElementById('bodyItens');      
const inputFornecedor = document.getElementById('inputFornecedor'); // Campo Fornecedor

// Botões Arquivos e Todos
const btnArquivos = document.getElementById('botaoArquivos');
const divArquivos = document.getElementById('divArquivos');
const btnTodos = document.getElementById('botaoTodos');

// LISTENERS
btnInserir.addEventListener('click', function (event) {
   event.preventDefault();
   valida();
});

btnCompartilhar.addEventListener('click', function (event) {
   event.preventDefault();
   VerificaPermissaoCopiar();
});

btnArquivos.addEventListener('click', function(event) {
    event.preventDefault();
    updateFileList();
});

btnTodos.addEventListener('click', function() {
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach(function(checkbox) {
         checkbox.checked = true;
    });
    somaPreco();
});

// FUNÇÕES
function insereNomeData(){
   // Obtém a data de hoje
   const hoje = new Date();
   const dia = String(hoje.getDate()).padStart(2, '0');
   const mes = String(hoje.getMonth() + 1).padStart(2, '0');
   const ano = hoje.getFullYear();
   const dataFormatada = `${dia}/${mes}/${ano}`;
   document.getElementById('appNameData').innerText = "APP Cotação - " + dataFormatada;
}

function valida() {
   let mensagemAlerta = "";
   if (descricaoItem.value === "") {
      mensagemAlerta = "*** Atenção Informe uma descrição ***";
   } else if (quantidadeItem.value === "") {
      mensagemAlerta = "*** Atenção Informe quantidade para o item ***";
   } else if (precoItem.value === "") {
      mensagemAlerta = "*** Atenção Informe o preço do item ***";
   }
   if (mensagemAlerta === "") {
      inserirLinha();
      inserirFootTotais();
      somaPreco();
      limpaCampos();
      salvarDados(); // Salva os dados automaticamente
   }
   divAlerta.textContent = mensagemAlerta;
}

function limpaCampos() {
   descricaoItem.value = "";
   quantidadeItem.value = 1;
   precoItem.value = "";
   descricaoItem.focus();
}

function somaPreco() {
   const precoTotal = document.getElementById('totalPreco');
   const precos = document.querySelectorAll('.qtdxPreco:not(.somaPreco)');
   let total = 0;
   precos.forEach(function (preco) {
      total += parseFloat(preco.textContent);
   });
   precoTotal.textContent = "R$ " + total.toFixed(2);
}

function inserirFootTotais() {
   const existingFoot = document.getElementById("footTotais");
   if (existingFoot) {
      existingFoot.remove();
   }
   const linha = document.createElement("tr");
   linha.id = "footTotais";
   const colunaTextoTotal = document.createElement("td");
   colunaTextoTotal.setAttribute('colspan', '3');
   colunaTextoTotal.className = "font-weight-bold";
   colunaTextoTotal.textContent = "TOTAL";
   const colunaTotalPreco = document.createElement("td");
   colunaTotalPreco.setAttribute('id', 'totalPreco');
   colunaTotalPreco.className = "font-weight-bold";
   const colunaVazia = document.createElement("td");
   colunaVazia.setAttribute('colspan', '1');
   linha.appendChild(colunaTextoTotal);
   linha.appendChild(colunaTotalPreco);
   linha.appendChild(colunaVazia);
   tabelaTbody.appendChild(linha);
}

function inserirLinha() {
   const linha = document.createElement("tr");
   const colunaDescricao = document.createElement("td");
   colunaDescricao.classList.add("maiusculoCentro");
   colunaDescricao.textContent = descricaoItem.value;
   const colunaQuantidade = document.createElement("td");
   colunaQuantidade.textContent = quantidadeItem.value;
   const colunaPreco = document.createElement("td");
   colunaPreco.textContent = precoItem.value;
   const colunaQuantxPreco = document.createElement("td");
   colunaQuantxPreco.classList.add("qtdxPreco");
   colunaQuantxPreco.textContent = (quantidadeItem.value * precoItem.value).toFixed(2);
   const colunaBotaoExcluir = document.createElement("td");
   const checkboxExcluir = document.createElement("input");
   checkboxExcluir.setAttribute("type", "checkbox");
   checkboxExcluir.style.transform = "scale(1.5)";
   checkboxExcluir.addEventListener("change", somaPreco);
   colunaBotaoExcluir.appendChild(checkboxExcluir);
   linha.appendChild(colunaDescricao);
   linha.appendChild(colunaQuantidade);
   linha.appendChild(colunaPreco);
   linha.appendChild(colunaQuantxPreco);
   linha.appendChild(colunaBotaoExcluir);
   tabelaTbody.appendChild(linha);
}

botaoExcluir.addEventListener('click', function () {
   removeLinha();
});

function removeLinha() {
   const checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
   checkboxes.forEach(function (checkbox) {
      checkbox.parentElement.parentElement.remove();
   });
   somaPreco();
}

function VerificaPermissaoCopiar(){
   if (navigator.permissions) {
      navigator.permissions.query({ name: 'clipboard-write' }).then(function(permissionStatus) {
         if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
               compartilharTabela();
         } else {
               alert("Por favor, conceda permissão para acessar a área de transferência.");
         }
      });
   } else {
      compartilharTabela();
   }
}

function compartilharTabela() {         
   const fornecedor = inputFornecedor.value.trim();
   if (!fornecedor) {
      alert("Por favor, insira o nome do fornecedor.");
      return;
   }
   const nomeData = document.getElementById('appNameData');
   const dataFormatada = nomeData.textContent;
   let textoCompartilhamento = `${dataFormatada}\n\n`;
   textoCompartilhamento += "Descrição\tQtd\t\tPreço\tTotal\n";
   const linhas = tabelaTbody.querySelectorAll("tr");
   linhas.forEach(linha => {
      if (linha.id !== "footTotais") {
         const colunas = linha.querySelectorAll("td");
         textoCompartilhamento += `${colunas[0].textContent}...........${colunas[1].textContent}.......${colunas[2].textContent}.....${colunas[3].textContent}\n`;
      }
   });
   const total = document.getElementById('totalPreco').textContent;
   textoCompartilhamento += `\nTotal: ${total}`;
   navigator.clipboard.writeText(textoCompartilhamento).then(() => {
      alert("Tabela copiada para a área de transferência!");
   }).catch(() => {
      alert("Erro ao copiar a tabela.");
   });
}

function salvarDados() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear().toString().slice(-2);
    const fornecedorNome = inputFornecedor.value.trim();
    if(!fornecedorNome) return;
    const fileName = fornecedorNome + '-' + dia + '-' + mes + '-' + ano;
    const dataRows = Array.from(tabelaTbody.querySelectorAll("tr")).filter(tr => tr.id !== "footTotais");
    let tableData = "";
    dataRows.forEach(row => {
       tableData += row.outerHTML;
    });
    const dataToSave = {
       tableData: tableData,
       fornecedor: fornecedorNome
    };
    localStorage.setItem("app_cotacao_" + fileName, JSON.stringify(dataToSave));
}

function updateFileList() {
    divArquivos.innerHTML = "";
    const prefix = "app_cotacao_";
    Object.keys(localStorage).forEach(function(key) {
       if (key.startsWith(prefix)) {
          const fileName = key.substring(prefix.length);
          const fileDiv = document.createElement('div');
          fileDiv.classList.add('arquivo-item');
          fileDiv.innerHTML = fileName + " ";
          
          const btnExcluirArquivo = document.createElement('button');
          btnExcluirArquivo.textContent = "Excluir";
          btnExcluirArquivo.addEventListener('click', function() {
             localStorage.removeItem(key);
             updateFileList();
          });
          fileDiv.appendChild(btnExcluirArquivo);
          
          const btnCarregarArquivo = document.createElement('button');
          btnCarregarArquivo.textContent = "Carregar";
          btnCarregarArquivo.addEventListener('click', function() {
             carregarArquivo(key);
          });
          fileDiv.appendChild(btnCarregarArquivo);
          
          divArquivos.appendChild(fileDiv);
       }
    });
}

function carregarArquivo(key) {
    const data = JSON.parse(localStorage.getItem(key));
    if(data && data.tableData) {
       tabelaTbody.innerHTML = data.tableData;
       inserirFootTotais();
       somaPreco();
    }
}

// Scroll com clique e arraste em qualquer ponto da aplicação (Mouse)
let isDragging = false;
let startX, startY, initialScrollX, initialScrollY;
document.addEventListener('mousedown', function(e) {
   if(e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA') {
      isDragging = true;
      startX = e.pageX;
      startY = e.pageY;
      initialScrollX = window.pageXOffset;
      initialScrollY = window.pageYOffset;
   }
});
document.addEventListener('mouseup', function(e) {
   isDragging = false;
});
document.addEventListener('mousemove', function(e) {
   if(isDragging) {
      e.preventDefault();
      const dx = e.pageX - startX;
      const dy = e.pageY - startY;
      window.scrollTo(initialScrollX - dx, initialScrollY - dy);
   }
});

// Scroll com toque (Touch)
let isTouching = false, touchStartX, touchStartY, touchInitialScrollX, touchInitialScrollY;
document.addEventListener('touchstart', function(e) {
   if(e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA') {
      isTouching = true;
      touchStartX = e.touches[0].pageX;
      touchStartY = e.touches[0].pageY;
      touchInitialScrollX = window.pageXOffset;
      touchInitialScrollY = window.pageYOffset;
   }
});
document.addEventListener('touchend', function(e) {
   isTouching = false;
});
document.addEventListener('touchmove', function(e) {
   if(isTouching) {
      const dx = e.touches[0].pageX - touchStartX;
      const dy = e.touches[0].pageY - touchStartY;
      window.scrollTo(touchInitialScrollX - dx, touchInitialScrollY - dy);
   }
});

insereNomeData();
