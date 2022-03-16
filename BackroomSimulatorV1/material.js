
				var materialCount = 0;
				var getMaterialName = function () {
					return "m" + ++materialCount;
				};
				var createMaterial=function(imagePath,scene){
					var material= new BABYLON.StandardMaterial(
						getMaterialName(),
						scene
					);
					material.diffuseTexture = new BABYLON.Texture(
						imagePath,
						scene
					);
					return material;
				}
				var createEmissiveMaterial=function(imagePath,scene){
					var material= new BABYLON.StandardMaterial(
						getMaterialName(),
						scene
					);
					material.emissiveTexture = new BABYLON.Texture(
						imagePath,
						scene
					);
					return material;
				}

/*
					var level0FloorMaterial = new BABYLON.StandardMaterial(
						"level0FloorMaterial",
						scene
					);
					level0FloorMaterial.diffuseTexture = new BABYLON.Texture(
						"./level0_floor.jpg",
						scene
					);
					*/