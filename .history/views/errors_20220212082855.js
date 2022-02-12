<%- include('includes/header.ejs',{active:'testing'}) %>
<div class="container">
    <% for (const [e] of Object.entries(params.errors)) { %>
        <div class="card">
            <div class="card-header">
            <%=e%>
            </div>
            <div class="card-body">
            <%-probe.lastTestingLog%>
            </div>
        </div>
        <Br> 
    <% } %>
</div>
<%- include('includes/footer.ejs') %>


