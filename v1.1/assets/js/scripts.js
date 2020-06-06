/*
	SOMETHINGS
*/

/*		DOM ELEMENTS		*/
const DOMElements = {
	messageContainer: document.getElementById('message-container'),
	
	
	/*		
														WELCOME VIEW	
	*/
	welcomeView: document.getElementById('welcome-view'),
	welcomeButton: document.getElementById('welcome-button'),
	
	
	
	
	
	
	/*		
														AUTH VIEW		
	*/
	authView: document.getElementById('auth-view'),
	googleAuthButton: document.getElementById('google-auth'),
	userPhoneInput: document.getElementById('user-phone-input'),
	userCodeInput: document.getElementById('user-code-input'),
	phoneAuthButton: document.getElementById('phone-auth'),
	laterAuthButton: document.getElementById('later-auth'),

	
	
	
	
	
	/*		
														MAIN VIEW	
	*/
	mainView: document.getElementById('main-view'),
	mainSection: document.getElementById('main-section'),
	
	/*
									BUSQUEDA SECTION
	*/	
	busquedaSection: document.getElementById('busqueda-section'),
	busquedaCategorias: document.getElementById('busqueda-categorias'),
	lastPosts: document.getElementById('last-posts'),
	
	
	/*
									MI AREA SECTION
	*/
	miAreaSection: document.getElementById('mi-area-section'),
	miAreaMainSection: document.getElementById('mi-area-main-section'),
	modifyUserButton: document.getElementById('modify-user-button'),
	logoutButton: document.getElementById('logout-button'),
	
	miAreaUserPostsContainer: document.getElementById('user-posts-container'),
	
	// ADD NEW POST (PRODUCT)
	addNewPostButton: document.getElementById('add-new-post'),
	// The others elements are defined later when The div is loaded
	
	
	
	/*				ME INTERESA DIV				*/
	meInteresaDiv: document.getElementById('me-interesa-div'),
	meInteresaButton: document.getElementById('me-interesa-button'),
	meInteresaContent: document.getElementById('me-interesa-content'),
	
	
	
	
	/*				THE DIV				*/
	theDiv: document.getElementById('the-div'),
	theButton: document.getElementById('the-button'),
	theTitle: document.getElementById('the-title'),
	theContent: document.getElementById('the-content'),
	
	
	
	
	
	// NAVIGATION MENU
	navigationMenu: document.getElementById('navigation-menu'),
	inicioButtonMenu: document.getElementById('inicio-button-menu'),
	busquedaButtonMenu: document.getElementById('busqueda-button-menu'),
	miAreaButtonMenu: document.getElementById('mi-area-button-menu'),
}

const displayMessage = (message, time = 4000) => {
	// Change message background depend of type (NOT TODAY BRO (06/06/2020) MAYBE IN THE NEXT UPDATE
	/*let messageType = "";
	if(type === "normal") {
		messageType = "var(--gray)";
	} else if(type === "warning") {
		messageType = "var(--warning)";
	} else if(type === "danger") {
		messageType = "var(--danger)";
	}*/ 
	
	// Shows message-container
	DOMElements.messageContainer.style.opacity = "1";
	DOMElements.messageContainer.style.visibility = "visible";
	
	// Insert the message
	DOMElements.messageContainer.innerHTML = message;
	
	// Hides message-container
	setTimeout(() => {
		DOMElements.messageContainer.style.opacity = "0";
		DOMElements.messageContainer.style.visibility = "hidden";
	}, time)
}

/*====================================================================================================================*/



/*
	FIREBASE
*/
	
const firebaseConfig = {
  apiKey: "AIzaSyBsa6U2yE0F3FhHGuMVLyFZQTVyjdo1UNg",
  authDomain: "mercado-san-carlos.firebaseapp.com",
  databaseURL: "https://mercado-san-carlos.firebaseio.com",
  projectId: "mercado-san-carlos",
  storageBucket: "mercado-san-carlos.appspot.com",
  messagingSenderId: "965906805596",
  appId: "1:965906805596:web:a1c304e1d76036b311c799",
  measurementId: "G-RLTRPT78YC"
};

//Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase database
const db = firebase.firestore();

// Firebase storage for files
const storageRef = firebase.storage().ref();

// Detect user state
firebase.auth().useDeviceLanguage();

firebase.auth().onAuthStateChanged(user => {
	if (user) {
		// User is signed in.
		let displayName = user.displayName ? user.displayName : "Por favor cambia tu nombre";
		let email = user.email ? user.email : user.phoneNumber;
		const emailVerified = user.emailVerified;
		let photoURL = user.photoURL ? user.photoURL : "/assets/images/default-user-photo.png";
		const anonymousUser = user.isAnonymous;
									
		if(anonymousUser) {
			displayLoggedScreen("Paisano (Anonimo)", "", "/assets/images/default-user-photo.png");
		} else {
			displayLoggedScreen(displayName, email, photoURL);
			
			// Shows F200 insignia
			db.collection("usersData").doc(`${email}`).get().then(doc => {
				if (doc.exists) {
					displayMessage("¡Muchas gracias por participar de la v1.1 D!.", 3000);
					
				} else {
					db.collection("usersData").doc(`${email}`).set({
						f200: true
					})
					.then(() => {
						displayMessage("¡Muchas gracias por participar de la v1.0D!.", 3000);
						displayMessage("¡Acabas de recibir la insignia F200 que solo se dará a los 200 primeros miembros y nunca más se volverá a dar!", 3000);
					})
					.catch(error => {
						displayMessage(error);
					});
				}
			}).catch(error => {
				displayMessage(error);
			});
				
			

		}
	
	} else {
		//User is not logged
		displayLogoutScreen();
	}
});

/******************************************************************/



/*
														LOGGED SCREEN
*/

const displayLoggedScreen = (userName, userEmail, userPhoto) => {
	// Hide welcome-view and auth-view
	DOMElements.welcomeView.style.display = "none"
	DOMElements.authView.style.display = "none";
	
	// Shows the main-view
	DOMElements.mainView.style.display = "block";
	
	
	
	/*				CONVERT MILITARY TIME TO STANDART				*/
	const toStandardTime = (militaryTime) => {
		let hour = militaryTime.substring (0, 2);	//Extract hour
        let minutes = militaryTime.substring (3, 5);	//Extract minutes
        let identifier = "a.m.";
 
        if(hour == 12){ //If hour is 12 set identifier to p.m.
          identifier = "p.m.";
        } else if(hour == 0){ //If hour is 0 set to 12 for standard time 12 a.m.
          hour = 12;
        } else if(hour > 12){ //If hour is greater than 12 convert to standard 12 hour format and set identifier to p.m.
          hour = hour - 12;
          identifier = "p.m.";
        }
        return `${hour}:${minutes} ${identifier}`;
      }
	
	
	
	
	/*					ME INTERESA DIV					*/
	const displayMeInteresaDiv = (postData) => {
		const { category, title, cover, price, contact, description, authorPhoto, author } = postData;
		
		// Shows me-interesa-div
		DOMElements.meInteresaDiv.style.top = "0";
		
		// Change me-interesa-content
		DOMElements.meInteresaContent.innerHTML = `
			<div id="post-contact-section">
				<h1>Contacta con ${author}</h1>
				<div id="contact-buttons">
					<a href="https://wa.me/57${contact}?text=Hola%2C%20${author}.%20Me%20interesa%20'${title}'"><div id="send-whatsapp">
						<img src="assets/images/whatsapp-logo.png">
						<h3>WhatsApp</h3>
					</div></a>
								
					<a href="tel:+57${contact}"><div id="call-phone">
						<img src="assets/images/phone-logo.png">
						<h3>Llamar</h3>
					</div></a>
				</div>
			</div>
	
			<div id="post-principal-section">
				<h1>${category}: ${title}</h1>
				<div id="post-cover" style='background-image: ${cover}'>
					<p id="post-price">${price}</p>
				</div>
				
				<p id="post-description">${description}</p>
			</div>
			
			
			
			<div id="post-author-section">
				<div id="left-side">
					<div id="author-photo" style='background-image: ${authorPhoto}'></div>
				</div>
				<div id="right-side">
					<h2>${author}</h2>
					<p>
						<img src='assets/images/insignias/f200.png' />
					</p>
				</div>
			</div>
		`;
	}
	
	
	// Hides me-interesa-div
	DOMElements.meInteresaButton.onclick = () => {
		// Hides me-interesa-div
		DOMElements.meInteresaDiv.style.top = "100vh";
		
	}
	
	
	
	
	
	
	
	
	/*					THE DIV					*/
	const displayTheDiv = (title, content, identificator) => {
		// Shows The div
		DOMElements.theDiv.style.top = "0";
		
		// Hides navigation-menu
		DOMElements.navigationMenu.style.display = "none";
		
		// Add another class to The div
		DOMElements.theDiv.classList.add(identificator);
		// Change The div content
		
		// Change The div title
		DOMElements.theTitle.innerHTML = title;
		
		DOMElements.theContent.innerHTML = content;
	}
	
	// Hides The div
	DOMElements.theButton.onclick = () => {
		// Hides The div
		DOMElements.theDiv.style.top = "100vh";
		
		// Remove class from The div
		const selectedClass = DOMElements.theDiv.className.split(" ")[1];
		DOMElements.theDiv.classList.remove(selectedClass);
		
		// Shows navigation-menu
		DOMElements.navigationMenu.style.display = "grid"
	}
	
	
	
	
	
	/*					PRINT POSTS					*/
	const printPost = (post, parentElement) => {	
		const { title, category, price, cover, contact, description, authorPhoto, author, formatedDate } = post.data();
													
		const postContainer = `
			<div class="postContainer" id="${author}-${contact}">
				<div class="postCover" style="background-image: url(${cover})">
					<p class="postCategory">${category}</p>
					<p class="postPrice">$${price}</p>
				</div>
				<div class="postInfo">
					<div class="leftSide">
						<div class="authorPhoto" style="background-image: url(${authorPhoto})"></div>
					</div>
					<div class="rightSide">
						<h3>${title}</h3>
						<p class="meInteresaButton">Me interesa</p>											
						<small>${formatedDate}</small>
					</div>
				</div>
				<div class="postDescriptionContainer">
					<svg class="postDescriptionButton" class="bi bi-chevron-down" width="1.8rem" height="1.8rem" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
					</svg>
					
					<div class="postDescription">
						<p>${description}</p>
					</div>
				</div>
			</div>
		`;
								
		parentElement.innerHTML += postContainer;
		
		parentElement.onclick = (e) => {
			if(e.target.className == "meInteresaButton") {
				/*				DETECT WHEN USER CLICKS ON "ME INTERESA"				*/
				const postContainer = e.path[3];
					const postContactData = postContainer.id.split("-");
					
					const postCover = postContainer.children[0].style.backgroundImage;
						const postCategory = postContainer.children[0].children[0].innerHTML;
						const postPrice = postContainer.children[0].children[1].innerHTML;
					
					const postInfo = postContainer.children[1].children;
						const leftSide = postInfo[0].children;
							const authorPhoto = leftSide[0].style.backgroundImage;
					
						const rightSide = postInfo[1].children;
							const postTitle = rightSide[0].innerText;
						
					const postDescription = postContainer.children[2].children[1].children[0].innerText;
					
					
				const postData = {
					title: postTitle,
					category: postCategory,
					price: postPrice,
					cover: postCover,
					contact: postContactData[1],
					description: postDescription,
					authorPhoto: authorPhoto,
					author:	postContactData[0]
				}
				
				displayMeInteresaDiv(postData);
				
			} else if(e.target.className.baseVal == "postDescriptionButton") {
				/*				DETECT WHEN USERS CLICKS ON "post-description-button"				*/
				
				// Change height of the respective .postContainer
				const postDescription = e.target.nextElementSibling;
				
				// Detect if it´s show or not :3
				postDescription.style.height = postDescription.style.height === "auto" ? "0" : "auto";
				
			}
		}
		
	}
	
	
	
	
	
	
	
	
	/*		Navigation menu script		*/
	const navigationMenu = (menu) => {
		const inicio = {
			normal: '<path fill-rule="evenodd" d="M7.646 1.146a.5.5 0 01.708 0l6 6a.5.5 0 01.146.354v7a.5.5 0 01-.5.5H9.5a.5.5 0 01-.5-.5v-4H7v4a.5.5 0 01-.5.5H2a.5.5 0 01-.5-.5v-7a.5.5 0 01.146-.354l6-6zM2.5 7.707V14H6v-4a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v4h3.5V7.707L8 2.207l-5.5 5.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M13 2.5V6l-2-2V2.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5z" clip-rule="evenodd"/>',
			filled: '<path d="M6.5 10.995V14.5a.5.5 0 01-.5.5H2a.5.5 0 01-.5-.5v-7a.5.5 0 01.146-.354l6-6a.5.5 0 01.708 0l6 6a.5.5 0 01.146.354v7a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5V11c0-.25-.25-.5-.5-.5H7c-.25 0-.5.25-.5.495z"/><path fill-rule="evenodd" d="M13 2.5V6l-2-2V2.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5z" clip-rule="evenodd"/>'
		}
		
		const miArea = {
			normal: '<path fill-rule="evenodd" d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM8 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z" clip-rule="evenodd"/>',
			filled: '<path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>'
		}
		
		// Deslect all buttons menu
		DOMElements.inicioButtonMenu.children[0].innerHTML = inicio.normal;
		DOMElements.busquedaButtonMenu.style.background = "transparent"; // That´s because search have other type of selected style
		DOMElements.miAreaButtonMenu.children[0].innerHTML = miArea.normal;
		
		// Hide all sections
		DOMElements.busquedaSection.style.top = "100vh";
		DOMElements.miAreaSection.style.top = "100vh";
		
		if(menu === "inicio") {
			// Select inicio-button-menu
			DOMElements.inicioButtonMenu.children[0].innerHTML = inicio.filled;
			
			
			/*				PRINT ALL APPROVED POSTS			*/
			const printApprovedPosts = () => {
				DOMElements.mainSection.innerHTML = "";
						
				db.collection("posts").where("approved", "==", true).orderBy("date", "desc").get()
				.then(querySnapshot => {
					querySnapshot.forEach(post => {
						// Just to be safe xd
						if(post.data().approved == true) {
							printPost(post, DOMElements.mainSection);
							
						}
					});
				})
				.catch(error => displayMessage(error))
			}
					
			printApprovedPosts();
		
		
		
		
		
		
		} else if(menu === "busqueda") {
			// Select busqueda-button-menu
			DOMElements.busquedaButtonMenu.style.background = "var(--primary)";
			
			// Shows busqueda-section
			DOMElements.busquedaSection.style.top = "0";
			
			
			
			
			
			
			
			
			
			/*					SEARCH POSTS BY CATEGORY				*/
			const getCategoryPosts = (category) => {
				// First we show The div with a basic info
				displayTheDiv(`<h1>Categoría: ${category}</h1>`, "", "categoryPosts");
				
				// Then we do a request to Firestore
				db.collection("posts").where("category", "==", category)
				.where("approved", "==", true).orderBy("date", "desc").get()
				.then(querySnapshot => {
					querySnapshot.forEach(post => {
						// And we print every post inside The div content
						printPost(post, DOMElements.theContent);
						
					});
				})
				.catch(error => displayMessage(error))
			}
			
			
			// Detects when user clicks on a category
			DOMElements.busquedaCategorias.onclick = (e) => {
				if(e.target.className == "categoriaContainer") {
					getCategoryPosts(e.target.innerText);
				} else if(e.target.localName == "img") {
					getCategoryPosts(e.target.nextElementSibling.innerText)
				} else if(e.target.localName == "p") {
					getCategoryPosts(e.target.innerText)
				}
			}
			
			
			
			
			
			/*					PRINT LAST POSTS				*/
			// Clean last posts every time section is open
			DOMElements.lastPosts.innerHTML = "";
			
			db.collection("posts").where("approved", "==", true)
			.orderBy("date", "desc").limit(10).get()
				.then(querySnapshot => {
					querySnapshot.forEach(post => {
						printPost(post, DOMElements.lastPosts);
						
					});
				})
				
			/*				DETECT WHEN USER CLICKS ON "ME INTERESA"				*/
			DOMElements.lastPosts.onclick = (e) => {
				if(e.target.className == "meInteresaButton") {
					const postContactData = e.path[3].id.split("-");
					const postTitle = e.path[2].children[1].children[0].innerText;
						
					displayMeInteresaDiv(`Contacta con ${postContactData[0]}`, postContactData[1], postContactData[0], postTitle);
				}
			} 
			
			
			
			
			
		} else if(menu === "mi area") {
			// Select mi-area-button-menu
			DOMElements.miAreaButtonMenu.children[0].innerHTML = miArea.filled;
			
			// Shows mi-area-section
			DOMElements.miAreaSection.style.top = "0";
			
			
			
			// Display actual user photo
			DOMElements.miAreaMainSection.children[0].children[0].style.backgroundImage = `url(${userPhoto})`;
			
			// Display actual user name
			DOMElements.miAreaMainSection.children[1].children[0].innerText = userName;
			
			
			
			DOMElements.logoutButton.onclick = () => {
				firebase.auth().signOut().then(() => {
					alert("Acabas de cerrar sesión.");
				}).catch(error => {
					alert(`Ocurrió un error: ${error}`);
				});
			}
		
		
			
			
			
			// Detects if users is logged or just a visitor (anonymous)
			if(userEmail === "") {			
				const loginNeeded = "Para vender debes crearte una cuenta, cierra sesión y registrate usando Google o tu número de celular.";
				
				// Only logged users can edit their profile, daa xd
				/*				MODIFICAR MIS DATOS BUTTON				*/
				DOMElements.modifyUserButton.onclick = () => {
					displayMessage(loginNeeded, 6000);
				}
				
				
				// Only logged users can add products
				/*					ADD NEW PRODUCT					*/
				DOMElements.addNewPostButton.onclick = () => {
					displayMessage(loginNeeded, 6000);
				}	
				
				
				
				
			} else {
				// Shows f200 insignia
				db.collection("usersData").doc(`${userEmail}`).get().then(doc => {
					if (doc.exists) {
						// Add a gold border to user photo
						DOMElements.miAreaMainSection.children[0].children[0].style.border = "3px solid gold";
						
						DOMElements.miAreaMainSection.children[0].children[0].innerHTML = "<img src='assets/images/insignias/f200.png' />"
					}
				})
				.catch(error => {
					displayMessage(error);
				});
				
				
				
				
				
				
				/*				MODIFICAR MIS DATOS BUTTON				*/
				DOMElements.modifyUserButton.onclick = () => {
					displayTheDiv("Modificar mis datos", `
						<div id="modify-user-container">
							<div id="modify-user-photo-container">
								<div id="user-photo-placeholder" style="background-image: url(${userPhoto})"></div>
								<h2>Foto de pérfil</h2>
								<input id="user-photo-input" type="file" />
							</div>
							
							<h2>Nombre de usuario</h2>
							<input id="user-name-input" type="text" value="${userName}" />
							
							<h2>Identificador</h2>
							<input id="user-identificator-input" type="text" disabled="true" value=${userEmail} />
							<p>* Por el momento no se permite modificar.</p>
							
							<button id="finish-user-modify" class="btn btn-block todolistoBtn">Todo listo!</button>
							
							<small>Si tienes alguna pregunta o inquietud envia un mensaje a <a href="https://wa.me/573216328834">3216328834 (movil Diego Cardona)</a></small>
						</div>
					`);
					
					/*				MODIFICAR MIS DATOS SCRIPT				*/
					const userPhotoPlaceholder = document.getElementById('user-photo-placeholder');
					const userPhotoInput = document.getElementById('user-photo-input');
					const userNameInput = document.getElementById('user-name-input');
					const finishUserModify = document.getElementById('finish-user-modify');
					
					// Change image of the product-placeholder-cover when selects an image
					userPhotoInput.onchange = () => {
						userPhotoPlaceholder.style.backgroundImage = 
						`url(${URL.createObjectURL(userPhotoInput.files[0])})`;
					}

					// Change name and photo when user clicks on finish-user-modify
					finishUserModify.onclick = () => {
						if(userNameInput.value != "") {
							finishUserModify.disabled = true;
							
							displayMessage("Actualizando datos...", 6000);
							
							const updateUserInfo = (name = userName, photo = userPhoto) => {
								// Updates user profile
								displayMessage("Actualizando datos...", 6000);
								
								firebase.auth().currentUser.updateProfile({
									displayName: name,
									photoURL: photo
								}).then(() => {
									// Shows success message
									displayMessage("Tu perfil se ha actualizado!");
											
									finishUserModify.disabled = false;
									
									// Reload page
									location.reload();
													  
								}).catch(error => {
									// Shows error message
									displayMessage(`Ha ocurrido un error: ${error}`);
										
									finishUserModify.disabled = false;
								});
							}
							
							
							// User wants a new photo
							if(userPhotoInput.files[0] != undefined) {
								const uploadUserPhoto = storageRef.child(`usersImages/${userEmail}`)
								.put(userPhotoInput.files[0]);
								
								uploadUserPhoto.then(snapshot => {
									displayMessage("Procesando imagen...", 8000);
									
									snapshot.ref.getDownloadURL().then(downloadURL => {
										// For the resized name, check if is an email or a phone number account
										const isEmailAcoount = userEmail.includes("@");
										
										let resizedImageURL = "";
										
										if(isEmailAcoount) {
											const imageURL = downloadURL.substring(0, downloadURL.indexOf("gmail.com"));
											const downloadToken = downloadURL.substring(downloadURL.indexOf("?"));
											resizedImageURL = `${imageURL}gmail_300x240.com${downloadToken}`
										} else {
											const imageURL = downloadURL.substring(0, downloadURL.indexOf("?"));
											const downloadToken = downloadURL.substring(downloadURL.indexOf("?"));
											resizedImageURL = `${imageURL}_300x240${downloadToken}`;
										}
										
										updateUserInfo(userNameInput.value, resizedImageURL);
									});
								})
								.catch(error => {
									// Shows error message
									displayMessage(`Ha ocurrido un error: ${error}`);
								});
								
							} else {
								updateUserInfo(userNameInput.value);
							}
							
						} else {
							displayMessage("Por favor ingresa un nombre de usuario.");
							
						}
					}
				}
				
				
				
				
				/*				PRINT ALL USER POSTS			*/
				const printUserPosts = () => {
					DOMElements.miAreaUserPostsContainer.innerHTML = "";
						
					db.collection("posts").where("authorEmail", "==", userEmail).orderBy("date", "desc").get()
					.then(querySnapshot => {
						querySnapshot.forEach(post => {
							if(post.data().authorEmail == userEmail) {
								const postData = {
									id: post.id,
									title: post.data().title,
									cover: post.data().cover,
									approved: post.data().approved,
									formatedDate: post.data().formatedDate
								}
								
								const postContainer = `
									<div class="userPost" id="${postData.id}">
										<div class="postCover" style="background-image: url(${postData.cover})">
											<small>${postData.approved ? "" : "Pendiente"}</small>
										</div>
										<div class="postInfo">
											<p>${postData.title}</p> <span class="btn-danger">X</span>
											<small>${postData.formatedDate}</small>
										</div>
									</div>
								`;
								
								DOMElements.miAreaUserPostsContainer.innerHTML += postContainer;
							}
						});
					})
					.catch(error => displayMessage(error))
				}
					
				printUserPosts();
				
				
				// Script for remove post if user click on <span class="btn-danger">X</span>
				DOMElements.miAreaUserPostsContainer.onclick = (e) => {
					if(e.target.className == "btn-danger") {
						const postId = e.path[2].id;
							
						db.collection("posts").doc(postId).delete()
						.then(() => {
							displayMessage("Publicación eliminada");
							printUserPosts();
						}).catch(error => {
							displayMessage(`Ocurrió un error: ${error}`);
						});
					}
				}
				
				
				
					
					
					
				
				
				/*					ADD NEW PRODUCT					*/
				DOMElements.addNewPostButton.onclick = () => {
					// Shows The div with the content of the add new post form
					displayTheDiv("¡Publica algo :D!", `
						<div id="add-new-post-form-container">
							<p>"La publicación será mostrada publicamente cuando sea revisada 
							y aprobada por nuestro equipo, muchas gracias por entenderlo!"</p>
							
							<div id="new-post-title">
								<h2>Título del producto/servicio o anuncio</h2>
								<input id="product-title-input" placeholder="Ejemplo: Vendo finca con terreno de 1000 hectareas" type="text" />
							</div>
							
							<div id="new-post-category">
								<h2>Selecciona una categoría</h2>
								<select id="product-category-input">
									<option value="Alimentos">Alimentos</option> 
									<option value="Cuidado personal">Cuidado personal</option>
									<option value="Automotriz">Automotriz</option>
									<option value="Productos del hogar">Productos del hogar</option> 
									<option value="Mascotas">Mascotas</option>
									<option value="Electrónicos">Electrónicos</option>
									<option value="Moda de Mujer">Moda de Mujer</option> 
									<option value="Moda de Hombre">Moda de Hombre</option>
									<option value="Moda Kids">Moda Kids</option>
									<option value="Libros">Libros</option>
									<option value="Otros" selected>Otros</option>
								</select>
								<p>* La categoría <b>Otros</b> es perfecta para publicar un anuncio</p>
							</div>
							
							<div id="new-post-price">
								<h2>Pon un precio</h2>
								<input id="product-price-input" type="number" placeholder="Por ejemplo: 10000">
								* Si publicas un anuncio, puedes poner <b>0</b>. Recuerda no poner puntos decimales, simplemente el precio
							</div>
							
							<div id="new-post-cover">
								<h2>¡Hazle una foto!</h2>
								<input id="product-cover-input" type="file" />
								<div id="product-placeholder-cover" style="background-image: url(assets/images/product-placeholder-cover-image.jpeg)"></div>
								<p>* Asegurate de que la imagen sea atractiva. La resolución de la imágen se rducirá para reducir espacio
								(esperamos mejorarlo pronto)</p>
							</div>	
							
							<div id="new-post-phone">
								<h2>Número de contacto</h2>
								<input id="product-contact-input" placeholder="Ejemplo: 3216328834" type="number"/>
								<p>* Este será el número con el cual te podrán contactar.</p>
							</div>
							
							<div id="new-post-description">
								<h2>Finalmente una descripción</h2>
								<textarea id="product-description-input" rows="8" placeholder="Aquí puedes escribir tanto cuanto quieras.La descripción ayuda a que quienes vean tu publicación sepan de que se trata. Si estás vendiendo un postre puedes poner los ingredients o lo que prefieras, la decisión es totalmente tuya <3"></textarea>
							</div>
							
							<button id="add-product-button" class="btn btn-block todolistoBtn">Todo listo!</button>
						</div>
					`);
					
					/*				ADD NEW PRODUCT FORM SCRIPT				*/
					const productTitleInput = document.getElementById('product-title-input');
					const productCategoryInput = document.getElementById('product-category-input');
					const productPriceInput = document.getElementById('product-price-input');
					const productCoverInput = document.getElementById('product-cover-input');
					const productPlaceholderCover = document.getElementById('product-placeholder-cover');
					const productContactInput = document.getElementById('product-contact-input');
					const productDescriptionInput = document.getElementById('product-description-input');
					const addProductButton = document.getElementById('add-product-button');
					
					
					// Change image of the product-placeholder-cover when selects an image
					productCoverInput.onchange = () => {
						productPlaceholderCover.style.backgroundImage = 
						`url(${URL.createObjectURL(productCoverInput.files[0])})`;
					}
					
					
					
					addProductButton.onclick = () => {
						const productTitle = productTitleInput.value;
						const productCategory = productCategoryInput.value;
						const productPrice = productPriceInput.value;
						const productCover = productCoverInput.files[0];
						const productContact = productContactInput.value;
						const productDescription = productDescriptionInput.value;
						
						// Adding (0/0/0 : 0:00 a.m) :3
						const fullDate = new Date();
						
						const dateToday = fullDate.toISOString().split("-");
						const day = dateToday[2].substring(0, dateToday[2].indexOf("T"));
						const month = dateToday[1];
						const year = dateToday[0];
						
						const timeToday = toStandardTime(fullDate.toString().split(" ")[4]);
						
						const formatedDate = `(${day}/${month}/${year} : ${timeToday})`;
						
						
						// Check if all data is filled
						if(productTitle != "" && productPrice != "" && productCover != undefined && productContact != "" && productDescription != "") {
							// Disable add-product-button to prevent errors
							addProductButton.disabled = true;
							
							displayMessage("Procesando datos...", 8000);
							
							// Add a new document with a generated id in firestore
							db.collection("posts").add({
								approved: false,
								title: productTitle,
								category: productCategory,
								price: productPrice,
								cover: "",
								contact: productContact,
								description: productDescription,
								author: userName,
								authorPhoto: userPhoto,
								authorEmail: userEmail,
								date: fullDate,
								formatedDate: formatedDate
							})
							.then(postRef => {
								displayMessage("Procesando imagen...", 8000);
								
								// Upload the selected image for cover wich his name is postRef
								const uploadCover = storageRef.child(`postsImages/${postRef.id}`)
								.put(productCoverInput.files[0]);
								
								uploadCover.then(snapshot => {
									displayMessage("Procesando imagen...", 8000);
									
									// Due to resize extension of firebase I need to get the download token from the URL
									snapshot.ref.getDownloadURL().then(downloadURL => {
										const imageURL = downloadURL.substring(0, downloadURL.indexOf("?"));
										const downloadToken = downloadURL.substring(downloadURL.indexOf("?"));
										const resizedImageURL = `${imageURL}_300x240${downloadToken}`
										
										db.collection('posts').doc(postRef.id).update({
											cover: resizedImageURL
										});
										
										
										// Shows a success message
										displayMessage("Todo correcto! en proceso de aprobación");
											
										// Clean inputs and reset product-placeholder-cover
										productTitleInput.value = "";
										productPriceInput.value = "";
										productCoverInput.type = "text";
										productCoverInput.type = "file";
										productPlaceholderCover.style.backgroundImage = 
										'url(assets/images/product-placeholder-cover-image.jpeg)';
										productContactInput.value = "";
										productDescriptionInput.value = "";
											
										addProductButton.disabled = false;	

										setTimeout(() => {
											printUserPosts();
										}, 2000)
									});
								});
							})
							.catch((error) => {
								displayMessage(error);
								
								addProductButton.disabled = false;
							});
							
						} else {
							// Shows an error message
							displayMessage("Por favor completa todos los campos");
							
							addProductButton.disabled = false;
						}
					}		
				}
			}	
		}
	}
		
	// Set inicio as default selected button menu
	navigationMenu("inicio");
		
	DOMElements.inicioButtonMenu.onclick = () => {
		navigationMenu("inicio");
	}
		
	DOMElements.busquedaButtonMenu.onclick = () => {
		navigationMenu("busqueda");
	}
		
	DOMElements.miAreaButtonMenu.onclick = () => {
		navigationMenu("mi area");
	}
}		

/*====================================================================================================================*/






/*
														LOGOUT SCREEN
*/	

const displayLogoutScreen = () => {
	// Hides main-view and auth-view
	DOMElements.mainView.style.display = "none";
	DOMElements.authView.style.display = "none";
	
	// Show welcome-view
	DOMElements.welcomeView.style.display = "block";
	

	/*						WELCOME VIEW SCRIPT					*/

	// Awesome effect on welcome button :3
	
	setTimeout(() => {
		DOMElements.welcomeButton.style.transform = "scale3d(1.2, 1.2, 1.2)";
		
		setTimeout(() => {
			DOMElements.welcomeButton.style.transform = "unset";
			
			setTimeout(() => {
				DOMElements.welcomeButton.style.transform = "scale3d(1.2, 1.2, 1.2)";
				
				setTimeout(() => {
					DOMElements.welcomeButton.style.transform = "unset";
				}, 3000)	
			}, 3000)
		}, 3000)
	}, 1000)
	
	
	// Run the welcome script :3
	DOMElements.welcomeButton.onclick = () => {
		// Just a little of time to make user to see the hover effect button
		setTimeout(() => {
			// Hides welcome-view
			DOMElements.welcomeView.style.display = "none";
			
			// Shows auth-view
			DOMElements.authView.style.display = "block";
			
			
			/*						ALLOW LOGIN BUTTONS					*/
			
			// Allow to click on google-auth button
			DOMElements.googleAuthButton.onclick = () => {
				firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
				
				firebase.auth().getRedirectResult()
					.catch(error => {
						// Shows error message trying to login user
						displayMessage(error.message);
					});
			}

			// Allow to click on phone-auth button
			DOMElements.phoneAuthButton.onclick = () => {
				let phoneNumber = DOMElements.userPhoneInput.value;
				
				if(phoneNumber != "") {
					let phoneNumberLength = phoneNumber.length;
					
					if(phoneNumberLength === 10) {
						const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
						
						// Disable button for prevent bugs
						DOMElements.phoneAuthButton.disabled = true;
							
						firebase.auth().signInWithPhoneNumber(`+57${phoneNumber}`, appVerifier)
							.then(confirmationResult => {	
								displayMessage("Código enviado!");
								
								// Show code input and change button text
								DOMElements.userCodeInput.style.display = "block";
								DOMElements.userPhoneInput.style.display = "none";
								DOMElements.phoneAuthButton.innerText = "Verificar código y finalizar proceso :D!"
								// Enable button 
								DOMElements.phoneAuthButton.disabled = false;
								// And hide reCAPTCHA
								document.getElementById('recaptcha-container').style.display = "none";
								
								
								//	GETTING THE VERIFICATION CODE
								DOMElements.phoneAuthButton.onclick = () => {
									let insertedCode = DOMElements.userCodeInput.value;
									if(insertedCode.length === 6) {
										confirmationResult.confirm(insertedCode).then(result => {
											// User signed in successfully.
/*var user = result.user;

											console.log(user)
											
											// Change user email to the user phone number
											firebase.auth().currentUser.updateProfile({
												email: user.phoneNumber
											}).then(() => {
												
												// Reload page
												//location.reload();
																  
											}).catch(error => {
												// Shows error message
												displayMessage(`Ha ocurrido un error: ${error}`);
											});*/
											
										  
										})
										.catch(function (error) {
											// User couldn't sign in (bad verification code?)
											displayMessage(error);
										});
										
										
									} else {
										displayMessage("El código debe tener 6 dígitos");
									}
								}
								
							  
							})
							.catch(function (error) {
								displayMessage(error);
							});
							
						
						
					} else {
						displayMessage(`Todo número tiene 10 dígitos, escribisté ${phoneNumberLength} dígitos`);
					}
					
				} else {
					displayMessage("Ingresa tú numéro")
				}
			}

			// Allow to click on later-auth button (wich is an <a> element :3)
			DOMElements.laterAuthButton.onclick = () => {
				firebase.auth().signInAnonymously().catch(error => {
				  // Shows error message trying to login anonymously
				  displayMessage(error.message);
				});

			}
		}, 500)
			
	}
}

/*====================================================================================================================*/