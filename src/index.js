import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Square was originally: 
	//class Square extends React.Component
	//it only contains a render method, so was changed to be a functional component

function Square(props) {
	//set components state in constructor
	//considered private by doing it this way, should be private
	//when the square is clicked, this.state will change b/c click is set to props.
	//add constructor to class to initilize the state
	//In JS: Must call super when defining constructor of a subclass
	//In React: All React component classes w/ a constructor should start with super(props)



	//**There was a constructor here originally, but it was moved to Board b/c Square no longer keeps track of game's state

	//When a component only contains a render method & doesn't have state, it can be a FUNCTIONAL component
		//instead of defining class as extending React.Component, write a function that takes props as input & returns what should be rendered
		//less tedious to write than classes


//removed the render() once it was changed from React.Component to function Square(props)
  // render() {
    return (
    	/* Square's render method will show value */
    	//the value is 0-8 and each number will display on the squares in order
    	//this is the button tag that is returned from the Square component's render()
    	//by passing in function:  ()=> will cause it to fire only when clicked
    		//originally had onClick = { () => alert('click')} before changing to this.setState({value: 'X'})
    	//not putting in () => and only doing onClick = {alert('click')} would have it fire everytime it's rendered
    	//components use state to remember things, such as button was clicked
    	//render method will display current state's value when clicked
    	//calling setState in a component will automatically update its child components
    	//pasing this setState with an X Value will cause the Square to ignore the value prop passed into it by Board component
     
    //when Square is clicked, onClick() provided by Board is called
    	//onClick prop in button tells React to set up click listener
    	//when button is clicked, React will call onClick() that's defined in Sqare's render() method
    	//This handler calls this.props.onClick().  Square's onCLick prop was specified by Board
    	//Board passed onClick {() => this.handleClick(i)} to Square. Square calls this.handleClick(i) when clicked
    	//handleClick() method will occur
    	//**onClick is a naming convention for React: on[Event] for events and handle[Event] for methods to handle the events


    //after changing from React.Component to Functional component, "this.props" was changed to "props"
    	//also changed onClick={() => this.props.onClick()} to onClikc = {props.onClick}
    		//in a class we used arrow function to access the correct "this"
    		//in functional component we don't need to worry about "this"
      <button 
      	className="square" onClick={props.onClick}>
        	{props.value}
      </button>
    );
}

class Board extends React.Component {
	//the game state should be stored in the Board Component instead of each squre
	//Board componenet can tell each Square what to display by passing a prop
	//To collect data from multiple children || to have 2 child components communicate w/ each other, a shared state must be declared in their parent component
		//the parent component can pass teh state back down to the children by using props
		//this will keep child components in sync w/ each other & w/ parent component
  //to lift state to parent component: add constructor to Board & set Board's initial state w/ array of 9 nulls
  	//this will start the game w/ an Array of 9 null values as its state
  		//as the game progresses, the square values will be stored in this array as state
  //cannot update Board's state directly from square as it's private
  //pass down a function from Board to Aquare to update state
  //to allow for O's: modify initial state in Board constructor
  	//added: "xIsNext: true,"
  		//each time player moves, xIsNext will be flipped to determine which players goes next & game state will be saved
  		//update Board's handlClick() to flip value of xIsNext (boolean)
    constructor(props) {
  	super(props);
  	this.state = {
  		squares: Array(9).fill(null),
  		xIsNext: true,
  	};
  }

  //this is the method for handleClick() that will happen when handleClick() is called
  //uses Array of squares from Board's constructor
  //state is stored in Board Component - when Board's state changes, squares automatically re-render
  	//storing them in Board instead of Squares allows it to determine winner
  	//Square component receives values from Board & informs Board component when they're clicked
  	//in React terms: the Square components are now CONTROLLED COMPONENTS (board has full control over them)
  //handleClick() will call slice() to create copy of squares array to modify instead of modifying existing array
  	//this makes the original array immutable
  		//Mutable = change data directly by changing data's values
  		//Immutable = replace data w/ a new copy that has changes to values
  		//Not mutating original data is important because:
  			//Immutability makes complex fatures easier to implement - permits undo & redo of actions by keeping previous versions intact
  			//Immutability makes detecting changes easier if objects are recreated & not changed by referencing objects that haven't been changed to new objects
  			//Immutability allows building PURE COMPONENTS in React - 
  				//if immutable, data can be easily determined to have changed and helps determine when componenet needs re-rendered
  				//shouldComponentUpdate() & Optimizing Performance can be better used w/ immutable data

  			//Each time player goes, xIsNext will be flipped to determine next player & game state saved
  				//added "this.state.xIsNext ? 'X' : 'O'" to flip value of xIsNext
  				//added "xIsNext: !this.state.xIsNext" to this.setState

  	//if someone has one the game || square already is filled, handleClick() will return early
  handleClick(i) {
  	const squares = this.state.squares.slice();
  	if (calculateWinner(squares) || squares[i]) {
  		return;
  	}
  	squares[i] = this.state.xIsNext ? 'X' : 'O';
  	this.setState({
  		squares: squares,
  		xIsNext: !this.state.xIsNext,
  	});
  }

//this functionw ill get called when a Square is clicked
//add parenthesis after return so JS doesn't enter a ; after return and break code
  renderSquare(i) {
  	//passing a prop called value into Square
  	//modify the Board to instruct individual Squares about its current value
  	//this will cause the renderSquare() to read from array in Board's constructor
  	//passing props down from Board to Square: value & onClick
    return (
   	 <Square 
    	value={this.state.squares[i]}
    	onClick ={() => this.handleClick(i)} 
      />
    );
  }

//change status to display which player has next turn
  render() {
  	const winner = calculateWinner(this.state.squares);
    // const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    let status;

    if (winner) {
    	status = 'Winner: ' + winner;
    } else {
    	status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

//helper function to determine winner
function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
	    [3, 4, 5],
	    [6, 7, 8],
	    [0, 3, 6],
	    [1, 4, 7],
	    [2, 5, 8],
	    [0, 4, 8],
	    [2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
