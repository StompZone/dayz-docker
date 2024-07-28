<script setup>
</script>

<template>
	<div class="middle">
		<h1>Login to Steam</h1>
		<form name="form" method="POST" action="/login" enctype="application/x-www-form-urlencoded">
			<div>
				<input type="text" name="username" placeholder="Username" />
			</div>
			<div>
				<input type="password" name="password" placeholder="Password" />
			</div>
			<div>
				<input type="text" name="guard" placeholder="Steam Guard" />
			</div>
			<div>
				<input type="checkbox" name="remember" id="remember" />
				<label for="remember">Remember me</label>
			</div>
			<div>
				<button type="submit" name="submit">Login</button>
			</div>
		</form>
	</div>
</template>

<style scoped>
.middle {
	margin: 0 auto;
	width: 50%;
	text-align: center;
}
</style>
