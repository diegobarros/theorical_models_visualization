///////////////////////////////////////////
// Região de Pré-processamento dos Dados // 
//////////////////////////////////////////

var colorBrewerTaxonomia = d3.scale.linear()
            .domain([0, 1, 2, 3, 4, 5])
    		.range(['#3f007d', '#54278f','#6a51a3','#807dba','#9e9ac8', '#bcbddc']);
    		
    		
    		
var colorBrewerFonte = d3.scale.linear()
            .domain([0, 1, 2, 3, 4, 5])
    		.range(['#333333', '#252525','#525252', '#737373', '#969696', '#bdbdbd']); 


var colorBrewerFramework = d3.scale.linear()
            .domain([0, 1, 2, 3, 4, 5])
    		.range(['#00441b', '#006d2c', '#238b45', '#41ab5d', '#74c476','#a1d99b']);
    		
    		
var colorBrewerClassificacao = d3.scale.linear()
            .domain([0, 1, 2, 3, 4, 5])
    		.range(['#7f2704', '#a63603','#d94801','#f16913','#fd8d3c','#fdae6b']);
    		
    		
    		
    		
    		
    		


const TAMANHO_CIRCULO = 5;
const TAMANHO_FONTE = 	12;


// Carrega os Dados
d3.csv("data/theorical_models.csv", function(error, data) {
	
	if (error) throw error;
	main(data);

});


function main(dados) {
	
	var termosAninhados = d3.nest()
		.key(function(d){ return d.termo_pai; })
		.entries(dados);
	
	
	
	
	termosHierarquicos = { id: dados[0].nome_modelo, values: termosAninhados };
	//CriaRadialTree(termosHierarquicos, "#container-radial-tree");
	//CriaMultiplosTermos(termosHierarquicos, "#container-radial-tree");
	//CriaHorizontalTree(termosHierarquicos, "#container-radial-tree");
	//CriaVerticalTree(termosHierarquicos, "#container-radial-tree");
	
	
	CriaCollasibleForce(termosHierarquicos, "#container-radial-tree");
	
} // Fim do método main


//////////////////////////////////////////
// Região de Criação das Visualizações // 
////////////////////////////////////////


/* Obtém o tamanho da imagem SVG */
function TamanhoSVG(container) {
	
	var width = parseFloat(d3.select(container).node().clientWidth);
	var height = parseFloat(d3.select(container).node().clientHeight);
	return [width, height];
	
} // Fim do método TamanhoSVG


function elbow(d, i) {
  return "M" + d.source.y + "," + d.source.x + "V" + d.target.x + "H" + d.target.y ; 
}



function CriaVerticalTree(dadosHierarquicos, container) {
	
	var tamanho = TamanhoSVG(container);
	
	var width = tamanho[0],
	    height = tamanho[1];
	
	var tree = d3.layout.tree()
    	.size([height, (width / 2)])
    	.children(function(d){ return d.values; })
    	.value(function(d) { return (d.children) ? d.values.length : 1 ; });

    	
    var svg = d3.select(container).append("svg")
		.attr("viewBox", "0 0 "+ width + " " + height)
		.attr("preserveAspectRatio", "xMidYMid meet")
	  	.append("g")
    		.attr("transform", "translate(" + width / 4 + "," + 0 + ")");
 
    
   	var nodes = tree.nodes(dadosHierarquicos);
    var links = tree.links(tree(dadosHierarquicos));

    var totalTermos = nodes[0].value;
    
      	
    var link = svg.selectAll(".link")
      	   	.data(links)
    	.enter().append("path")
      		.attr("class", "link")
      		.attr("d", elbow)
      		.attr("stroke", function(d) { return colorBrewerClassificacao(d.source.depth); })
      		.style("stroke-width", 1);
      		
      		
    var node = svg.selectAll(".node")
      		.data(nodes)
    	.enter().append("g")
      		.attr("class", "node")
      		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
	
	node.append("circle")
		.attr("fill", function(d) { return "#FFFFFF"; })
		.style("stroke-width", 2)
		.attr("stroke", function(d) { return colorBrewerClassificacao(d.depth); }) 
		.attr("r", function(d){
			
      		var escala = d3.scale.linear().domain([0, 10, 20, 30, 40,50,60,70,80,90, 100])
      			.range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    		 
			var porcentagemTermos = Math.ceil((d.value * 100) / totalTermos);
			
			return escala(porcentagemTermos) + TAMANHO_CIRCULO; 
			
		});
		
		
	

	node.append("text")
      	.attr("dx", function(d) { 
      		
      		if (d.children && d.depth == 0)
      			return 0;
      		else if (d.children)
      			return  (-(d.values.length + TAMANHO_CIRCULO) - 6); 
      		else 
      			return TAMANHO_CIRCULO + 8;	
      		
      	})
      	.attr("dy", function(d) {
      		
      		
      		if (d.children && d.depth == 0)
				return (-(d.values.length + TAMANHO_CIRCULO) - 20);
			else return 5; 
      		
      		
         })
      	.attr("text-anchor", function(d) { 
      		
      		
      		if (d.children && d.depth == 0)
      			return "middle";
      		 else if (d.children)
      			
      			return "end";
      		else 
      			return "start";
      		
      	})
      	.attr("fill", function(d) { return colorBrewerFonte(d.depth); })
      	.attr("font-size", function(d) { 
      		
      		var escala = d3.scale.linear().domain([0, 25, 50, 75, 100])
      			.range([0, 2, 4, 6, 8]);
    				
      		
      		var porcentagemTermos = Math.ceil((d.value * 100) / totalTermos);	
      		return  Math.ceil(TAMANHO_FONTE + escala(porcentagemTermos));  
      	})
      	.attr("transform", function(d) { if (d.children && d.depth == 0) {  return  "rotate(-90)"; } })
      	.text(function(d) {  return d.termo || d.id || d.key; });
      	

} // Fim do método CriaHorizontalTree


function CriaHorizontalTree(dadosHierarquicos, container) {
	
	var tamanho = TamanhoSVG(container);
	
	var width = tamanho[0],
	    height = tamanho[1];
	
	var tree = d3.layout.tree()
    	.size([height, (width / 2)])
    	.children(function(d){ return d.values; })
    	.value(function(d) { return (d.children) ? d.values.length : 1 ; });

	var diagonal = d3.svg.diagonal()
    	.projection(function(d) { return [d.y, d.x]; });
    	
    	
    var svg = d3.select(container).append("svg")
		.attr("viewBox", "0 0 "+ width + " " + height)
		.attr("preserveAspectRatio", "xMidYMid meet")
	  	.append("g")
    		.attr("transform", "translate(" + width / 4 + "," + 0 + ")");
 
    
   	var nodes = tree.nodes(dadosHierarquicos);
    var links = tree.links(tree(dadosHierarquicos));

    var totalTermos = nodes[0].value;
    
      	
    var link = svg.selectAll(".link")
      	   	.data(links)
    	.enter().append("path")
      		.attr("class", "link")
      		.attr("d", diagonal)
      		.attr("stroke", function(d) { return colorBrewerTaxonomia(d.source.depth); });
      		
      		
    var node = svg.selectAll(".node")
      		.data(nodes)
    	.enter().append("g")
      		.attr("class", "node")
      		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
	
	node.append("circle")
		.attr("fill", function(d) { return colorBrewerTaxonomia(d.depth); })
		.attr("stroke", function(d) { return colorBrewerTaxonomia(d.depth); }) 
		.attr("r", function(d){
			
      		var escala = d3.scale.linear().domain([0, 10, 20, 30, 40,50,60,70,80,90, 100])
      			.range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    		 
			var porcentagemTermos = Math.ceil((d.value * 100) / totalTermos);
			
			return escala(porcentagemTermos) + TAMANHO_CIRCULO; 
			
		});
		
		
	

	node.append("text")
      	.attr("dx", function(d) { 
      		
      		if (d.children && d.depth == 0)
      			return 0;
      		else if (d.children)
      			return  (-(d.values.length + TAMANHO_CIRCULO) - 6); 
      		else 
      			return TAMANHO_CIRCULO + 8;	
      		
      	})
      	.attr("dy", function(d) {
      		
      		
      		if (d.children && d.depth == 0)
				return (-(d.values.length + TAMANHO_CIRCULO) - 20);
			else return 5; 
      		
      		
         })
      	.attr("text-anchor", function(d) { 
      		
      		
      		if (d.children && d.depth == 0)
      			return "middle";
      		 else if (d.children)
      			
      			return "end";
      		else 
      			return "start";
      		
      	})
      	.attr("fill", function(d) { return colorBrewerFonte(d.depth); })
      	.attr("font-size", function(d) { 
      		
      		var escala = d3.scale.linear().domain([0, 25, 50, 75, 100])
      			.range([0, 2, 4, 6, 8]);
    				
      		
      		var porcentagemTermos = Math.ceil((d.value * 100) / totalTermos);	
      		return  Math.ceil(TAMANHO_FONTE + escala(porcentagemTermos));  
      	})
      	.attr("transform", function(d) { if (d.children && d.depth == 0) {  return  "rotate(-90)"; } })
      	.text(function(d) {  return d.termo || d.id || d.key; });
      	

} // Fim do método CriaHorizontalTree



function CriaRadialTree(dadosHierarquicos, container) {
	
	var tamanho = TamanhoSVG(container);
	var diameter = tamanho[0];
	
	var width = diameter,
	    height = diameter - 30;
	
	var tree = d3.layout.tree()
    	.size([360, diameter / 2 - 120])
    	.children(function(d){ return d.values; })
    	.value(function(d) { return (d.children) ? d.values.length : 1 ; })
    	.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

	var diagonal = d3.svg.diagonal.radial()
    	.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
 
    	
    var svg = d3.select(container).append("svg")
		.attr("width", width)
    	.attr("height", height)
		.attr("viewBox", "0 0 "+ width + " " + height)
		.attr("preserveAspectRatio", "xMidYMid meet")
	  	.append("g")
    		.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
 
    
   	var nodes = tree.nodes(dadosHierarquicos);
    var links = tree.links(tree(dadosHierarquicos));
    
    var totalTermos = nodes[0].value;
    
      	
    var link = svg.selectAll(".link")
      	   	.data(links)
    	.enter().append("path")
      		.attr("class", "link")
      		.attr("d", diagonal)
      		.attr("stroke", function(d) { return colorBrewerFramework(d.source.depth); });
      		
      		
    var node = svg.selectAll(".node")
      		.data(nodes)
    	.enter().append("g")
      		.attr("class", "node")
      		.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
	
	node.append("circle")
		.attr("fill", function(d) { return colorBrewerFramework(d.depth); })
		.attr("stroke", function(d) { return colorBrewerFramework(d.depth); }) 
		.attr("r", function(d){
			
      		var escala = d3.scale.linear().domain([0, 10, 20, 30, 40,50,60,70,80,90, 100])
      			.range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    		 
			var porcentagemTermos = Math.ceil((d.value * 100) / totalTermos);
			
			return escala(porcentagemTermos) + TAMANHO_CIRCULO; 
			
		});;
	

	node.append("text")
      	.attr("dy", ".31em")
      	.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      	.attr("transform", function(d) { return d.x < 180 ? "translate(14)" : "rotate(180)translate(-20)"; })
      	.attr("fill", function(d) { return colorBrewerFonte(d.depth); })
      	.attr("font-size", function(d) { 
      		
      		var escala = d3.scale.linear().domain([0, 25, 50, 75, 100])
      			.range([0, 2, 4, 6, 8]);
    				
      		
      		var porcentagemTermos = Math.ceil((d.value * 100) / totalTermos);	
      		return  Math.ceil(TAMANHO_FONTE + escala(porcentagemTermos));  
      	})
      	.text(function(d) {  return d.termo || d.id || d.key; });
      	

} // Fim do método CriaRadialTree




function CriaMultiplosTermos(dadosHierarquicos, container) {
	
	
	var tamanho = TamanhoSVG(container);
	
	var width = 200,
	    height = 200;    	
    
    var svg = d3.select(container).selectAll("svg")
    	.data(d3.range(16).map(function() { return {x: width / 2 , y: height / 2}; }))	
  		.enter().append("svg")
		.attr("viewBox", "0 0 "+ width + " " + height)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.attr("width", width)
		.attr("height", height)
		.style("float", "left")
		.style("background-color", "#CDCDCD")
		.style("border", "3px solid white");

}



function CriaCollasibleForce(dadosHierarquicos, container) {
	
	
	var tamanho = TamanhoSVG(container);
	
	var width = tamanho[0] / 4,
	    height = tamanho[1] / 4;
	    
	    
	var svg = d3.select(container).append("svg")
		.attr("viewBox", "0 0 "+ width + " " + height)
		.attr("preserveAspectRatio", "xMidYMid meet");
			    
	
	var tree = d3.layout.tree()
    	.size([width, height])
    	.children(function(d){ return d.values; })
    	.value(function(d) { return (d.children) ? d.values.length : 1 ; });
    	
    
    	 	
    var force = d3.layout.force()
    	.size([width, height])
    	.on("tick", tick);
    	   	

		    
    AtualizaCollasibleForce(dadosHierarquicos, tree, force, container);
	
}


function tick() {
	
	var svg = d3.select("#container-radial-tree svg");
	
	var link = svg.selectAll(".link"),
    	node = svg.selectAll(".node");	
	
	
	
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}






//////////////////////////////////////////
// Região de Desenho das Visualizações // 
////////////////////////////////////////

function AtualizaCollasibleForce(dados, tree, force, container) {
	
	var svg = d3.select(container + " svg");
	
	var link = svg.selectAll(".link"),
    	node = svg.selectAll(".node");
	
	var nodes = tree.nodes(dados);
    var links = tree.links(tree(dados));
    
    var totalTermos = nodes[0].value;
    
    force.nodes(nodes)
      .links(links)
      .start();
      
      link = link.data(links);
      
      link.exit().remove();
      
      link.enter().insert("line", ".node")
      	.attr("class", "link")
      	.attr("x1", function(d) { return d.source.x; })
      	.attr("y1", function(d) { return d.source.y; })
      	.attr("x2", function(d) { return d.target.x; })
      	.attr("y2", function(d) { return d.target.y; })
      	.attr("stroke", function(d) { return colorBrewerFonte(d.source.depth); })
      	.style("stroke-width", 0.4);
      	
      	
      node = node.data(nodes);
      node.exit().remove();
      
      
      
      node.enter().append("circle")
      	.attr("class", "node")
      	.attr("cx", function(d) { return d.x; })
      	.attr("cy", function(d) { return d.y; })
      	.attr("r", function(d) { 
      		
      		var escala = d3.scale.linear().domain([0, 10, 20, 30, 40,50,60,70,80,90, 100])
      			.range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    		 
			var porcentagemTermos = Math.ceil((d.value * 100) / totalTermos);
			
			return escala(porcentagemTermos) + TAMANHO_CIRCULO; 
      		
      		//Math.sqrt(d.value) / 10 || 4.5
      		
      		//return ; 
      	
      	})
      	.style("fill", function(d) { return colorBrewerFonte(d.depth);})
     //.on("click", click)
      	.call(force.drag);
      
      
      
      
      
      
      

 
}














