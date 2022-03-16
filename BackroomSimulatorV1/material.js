var materialCount = 0;
var getMaterialName = function () {
	return "m" + ++materialCount;
};
var createMaterial = function (imagePath, scene) {
	var material = new BABYLON.StandardMaterial(getMaterialName(), scene);
	material.diffuseTexture = new BABYLON.Texture(imagePath, scene);
	return material;
};
var createEmissiveMaterial = function (imagePath, scene) {
	var material = new BABYLON.StandardMaterial(getMaterialName(), scene);
	material.emissiveTexture = new BABYLON.Texture(imagePath, scene);
	return material;
};
var createMaterialFromColor = function (r, g, b, scene) {
	var material = new BABYLON.StandardMaterial(getMaterialName(), scene);
	material.diffuseColor = new BABYLON.Color3(r, g, b);
	return material;
};
var createEmissiveMaterialFromColor = function (r, g, b, scene) {
	var material = new BABYLON.StandardMaterial(getMaterialName(), scene);
	material.emissiveColor = new BABYLON.Color3(r, g, b);
	return material;
};
