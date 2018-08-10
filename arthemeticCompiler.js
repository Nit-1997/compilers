//tokenizes the code into chunks(tokens) that is array of words

// const lex = async (code) =>{
//    const arr = code.split(' ');
// 	   arr.map(ele=>ele.trim())
// 	      .filter(ele=>ele.length);
// 	//console.log(arr);
// 	return arr;
// }
const tokenizer = str => str.split(' ').map(s => s.trim()).filter(s => s.length);


//abstract syntax tree construction
const Op = Symbol('op');
const Num = Symbol('num');

const parser = (tokenArray) => {
	// let temp = [];
	// await tokenArray.then(data=>{
 //       temp =[...data];
	// }).catch(err=>{
 //       console.log(err);
	// });
	// tokenArray = temp;
	let counter = 0;
	const curr = () => tokenArray[counter];
	const next = () => tokenArray[counter++];

	const parseNum = () =>{
		return(
		{
			value:parseInt(next()),
			type:Num
		}
		);
	}

	const parseOp = () =>{
		const node = {
			value:next(),
			type:Op,
			expression: []
		};
		while(curr()){
			node.expression.push(parseExpression());
		}
		return node;
	};
	const parseExpression = () =>{
		return (
			/\d/.test(curr())?parseNum():parseOp()
			)
	};
	return parseExpression();
}


//converting the Abstract syntax tree to Javascript

const translate = ast => {
  const opAcMap = {
    sum: args => args.reduce((a, b) => a + b, 0),
    sub: args => args.reduce((a, b) => a - b),
    div: args => args.reduce((a, b) => a / b),
    mul: args => args.reduce((a, b) => a * b, 1)
  };

  if (ast.type === Num) return ast.value;
  return opAcMap[ast.value](ast.expression.map(translate));
};



const compile = ast => {
  const opMap = { sum: '+', mul: '*', sub: '-', div: '/' };
  const compileNum = ast => ast.value;
  const compileOp = ast => `(${ast.expression.map(compile).join(' ' + opMap[ast.value] + ' ')})`;
  const compile = ast => ast.type === Num ? compileNum(ast) : compileOp(ast);
  return compile(ast);
};


const program = 'mul 3 2 2 2 sub 2 1 3 2 sum 1 2 3 1 1 4';

console.log(translate(parser(tokenizer(program))));
console.log(compile(parser(tokenizer(program))));

//console.log(compile(parse(lex(program))));


// lexerTokenizer(program).then(data => {
// 	console.log(translate(parser(data)));
// });



