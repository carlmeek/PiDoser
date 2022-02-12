<%- include('includes/header.ejs',{active:'testing'}) %>
<div class="container">
    <% for (const [e] of Object.entries(params.probes)) { %>
        <div class="card">
            <div class="card-header">
            <%=probe.title%> - <%=probe.desc%>
            </div>
            <div class="card-body">
            <%-probe.lastTestingLog%>
            </div>
        </div>
        <Br> 
    <% } %>
</div>
<%- include('includes/footer.ejs') %>


