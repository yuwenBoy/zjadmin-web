
export function randomColor()
{
    var r=random(0,256),
    g=random(0,256),
    b=random(0,256);
    var result="rgb("+r+","+g+","+b+")";
    return result;
}
function random(lower,upper){
  return Math.floor(Math.random()*(upper-lower+1)+lower)
}