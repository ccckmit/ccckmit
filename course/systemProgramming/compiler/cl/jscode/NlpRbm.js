var R=require("./randomLib");
/*
問題: 處理 bank 的歧義性
歧義： bank = 銀行 (organization), 河岸 (place)
歧義範例： http://dj.iciba.com/bank-1.html

語句產生： 

Org 


銀行=bank account, 
河岸=river bank, 



*/
var peoples = ["小明", "小華", "小莉", "大雄"];
var objects = ["蘋果", "橘子", "柳丁", "番茄"];
var owner = People();
var object = Object();
var nOwn = R.randomInt(3, 20);

remove(peoples, owner);

function remove(array, item) {
	array.splice(array.indexOf(item), 1);	
}

function MathTest() {
  return "問題:\t"+Own()+"\n\t"+Give()
	       +"\n\t又"+Give()+"\n\t"+Question();
}

function Own() {
	return owner+"有"+nOwn+"個"+object;
}

function Give() {
	var nGive = R.randomInt(1, nOwn);
	nOwn-=nGive;
	return "給了"+People()+nGive+"個";
}

function Question() {
	return "請問"+owner+"還有幾個"+object+"?";
}

function People() {
	return R.sample(peoples);
}

function Object() {
	return R.sample(objects);
}

console.log(MathTest());
console.log("\n答案:\t"+nOwn+"個");
