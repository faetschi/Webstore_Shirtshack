<?php session_start(); ?>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
      <a class="navbar-brand" href="home.html">WebShop</a>
      <div class="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
    <!-- left side navbar -->
          <div class="navbar-nav">
        <!-- always available -->
            <li class="nav-item">
                <a class="nav-link" href="products.html">Products</a>
            </li>
            <li>
                <a class="nav-link" href="coupons.html">Coupons</a>
            </li>
        <!-- user is logged in -->
          <?php if (isset($_SESSION["username"]) || isset($_COOKIE["username"])): ?>
            <li class="nav-item">
                <a class="nav-link" href="home.html">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="orders.html">Orders</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="invoices.html">Invoices</a>
            </li>
          <?php endif; ?>
          </div>
    <!-- right side navbar -->
          <div class="navbar-nav">
            <li class="nav-item align-self-center">
                <form class="form-inline d-flex">
                    <input class="form-control form-control-sm mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success btn-sm my-2 my-sm-0" type="submit" style="margin-left: 5px;">Search</button>
                </form>
            </li>
        <!-- user is logged in -->
          <?php if (isset($_SESSION["username"]) || isset($_COOKIE["username"])): ?>
            <li class="nav-item">
                <a class="nav-link" href="../../Backend/logic/logout.php">Logout</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="account.html">My Account</a>
            </li>
          <?php endif; ?>
        <!-- always available -->
          <li class="nav-item">
                <a class="nav-link" href="#">Cart</a>
          </li>
        <!-- user is not logged in -->
          <?php if (!isset($_SESSION["username"]) && !isset($_COOKIE["username"])): ?>
            <li class="nav-item">
                <a class="nav-link" href="login.html">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="register.html">Register</a>
            </li>
          <?php endif; ?>
          </div>
      </div>
  </div>
</nav>