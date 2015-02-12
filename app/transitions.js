export default function(){
	this.transition(
		this.childOf('#AnimatedNumber'),
		this.use('toUp')
	);
}
