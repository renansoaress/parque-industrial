<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="/">Parque Industrial</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Alterna navegação">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                <a class="nav-item nav-link" href="#" v-on:click.stop.prevent="setPage('status')">Status</a>
                <a class="nav-item nav-link" href="#" v-on:click.stop.prevent="setPage('simulador')">Simulador</a>
                </div>
            </div>
        </nav>
        <div class="container">
            <div class="row pt-5">
                <div class="col-md-12">
                    <template v-if="form === false">
                        <template v-if="currentPage === 'machines'">
                            <table class="table">
                                <thead class="thead-dark">
                                    <tr>
                                    <th scope="col">Máquina</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">
                                        <button class="btn btn-primary" 
                                            @click="createMachine">
                                                Inserir
                                        </button>
                                    </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="machine of machines" :key="machine.id">
                                        <td>{{machine.nome}}</td>
                                        <td>{{machine.status !== null ? machine.status.nome : "Sem status"}}</td>
                                        <td>
                                            <button class="btn btn-danger" 
                                            @click="deleteMachine(machine._id)">
                                                Delete
                                            </button>
                                            <button class="btn btn-secondary" 
                                            @click="editMachine(machine._id)">
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                        <template v-else-if="currentPage === 'status'">
                            <table class="table">
                                <thead class="thead-dark">
                                    <tr>
                                    <th scope="col">Status</th>
                                    <th scope="col">Código</th>
                                    <th scope="col">
                                        <button class="btn btn-primary" 
                                            @click="createStatus">
                                                Inserir
                                        </button>
                                    </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="stat of status" :key="stat.id">
                                        <td>{{stat.nome}}</td>
                                        <td>{{stat.codigo}}</td>
                                        <td>
                                            <button class="btn btn-danger" 
                                            @click="deleteStatus(stat._id)">
                                                Delete
                                            </button>
                                            <button class="btn btn-secondary" 
                                            @click="editStatus(stat._id)">
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                    </template>
                    
                    <!-- Form -->

                    <template v-else>
                        <div class="card">
                            <div class="card-body">
                                <template v-if="currentPage === 'machines'">
                                    <form @submit.prevent="sendMachine">
                                        <div class="form-group">
                                            <input type="text" 
                                            v-model="machine.nome"
                                            placeholder="Nome da máquina"
                                            class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <select v-model="machine.status" class="form-control">
                                                <option v-for="sta of status" :key="sta.id" :value="sta._id">{{sta.nome}}</option>
                                            </select>
                                        </div>
                                        <template v-if="edit === false">
                                            <button class="btn btn-primary btn-block">Criar</button>
                                        </template>
                                        <template v-else>
                                            <button class="btn btn-primary btn-block">Alterar</button>
                                        </template>
                                    </form>
                                </template>

                                <template v-else-if="currentPage === 'status'">
                                    <form @submit.prevent="sendStatus">
                                        <div class="form-group">
                                            <input type="text" 
                                            v-model="sta.nome"
                                            placeholder="Nome do Status"
                                            class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <input type="text" 
                                            v-model="sta.codigo"
                                            placeholder="Código do Status"
                                            class="form-control">
                                        </div>
                                        <template v-if="edit === false">
                                            <button class="btn btn-primary btn-block">Criar</button>
                                        </template>
                                        <template v-else>
                                            <button class="btn btn-primary btn-block">Alterar</button>
                                        </template>
                                    </form>
                                </template>

                                <template v-else-if="currentPage === 'simulador'">
                                    <form @submit.prevent="updateCron">
                                        <div class="form-group">
                                            <input type="text" 
                                            v-model="itemToEdit.tempo"
                                            placeholder="Tempo do evento (00:00) MINUTOS:SEGUNDOS"
                                            class="form-control">
                                        </div>
                                        <button class="btn btn-primary btn-block">Alterar</button>
                                    </form>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    class Machine {
        constructor(nome, status) {
            this.nome = nome;
            this.status = status
        }
    }

    class Status {
        constructor(nome, codigo) {
            this.nome = nome;
            this.codigo = codigo
        }
    }

    export default {
        data() {
            return {
                machine: new Machine(),
                sta: new Status(),
                machines: [],
                status: [],
                form: false,
                edit: false,
                itemToEdit: '',
                currentPage: 'machines',
            }
        },
        created() {
            this.getMachines();
        },
        methods: {
            setPage(page){
                if(page === "status"){
                    this.getStatus();
                    this.edit = false;
                    this.form = false;
                }
                else if(page === "simulador"){
                    this.edit = true;
                    this.form = true;
                    this.getCron();
                }
                this.currentPage = page
            },

            // Cron
            getCron(id){
                fetch('/api/cron')
                .then(res => res.json())
                .then(data => {
                    this.itemToEdit = data
                });
            },
            updateCron(){
                fetch('/api/cron/', {
                        method: "PUT",
                        body: JSON.stringify(this.itemToEdit),
                        headers: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        this.form = false;
                        this.edit = false
                        this.currentPage = "machines";
                        this.getMachines();
                    });
            },

            // Status
            createStatus(){
                this.form = true
                this.edit = false
            },
            getStatus() {
                fetch('/api/status')
                .then(res => res.json())
                .then(data => {
                    this.status = data;
                });
            },
            editStatus(id){
                fetch('/api/status/' + id)
                .then(res => res.json())
                .then(data => {
                    this.sta = new Status(data.nome, data.codigo);
                    this.itemToEdit = data._id;
                    this.edit = true;
                    this.form = true
                });
            },
            sendStatus(){
                if(this.edit === false){
                    fetch('/api/status', {
                        method: 'POST',
                        body: JSON.stringify(this.sta),
                        headers: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        this.form = false;
                        this.getStatus();
                    })
                } else {
                    fetch('/api/status/' + this.itemToEdit, {
                        method: "PUT",
                        body: JSON.stringify(this.sta),
                        headers: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        this.form = false;
                        this.edit = false
                        this.getStatus();
                    });
                }
                this.sta = new Status();
            },
            deleteStatus(id) {
                fetch('/api/status/' + id, {
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    this.getStatus();
                });
            },

            // Machine
            createMachine(){
                this.form = true
                this.edit = false
                this.getStatus();
            },
            getMachines() {
                fetch('/api/machines')
                .then(res => res.json())
                .then(data => {
                    this.machines = data;
                });
            },
            editMachine(id){
                fetch('/api/machines/' + id)
                .then(res => res.json())
                .then(data => {
                    this.machine = new Machine(data.nome, data.status);
                    this.itemToEdit = data._id;
                    this.edit = true;
                    this.form = true
                    this.getStatus();
                });
            },
            sendMachine(){
                if(this.edit === false){
                    fetch('/api/machines', {
                        method: 'POST',
                        body: JSON.stringify(this.machine),
                        headers: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        this.form = false;
                        this.getMachines();
                    })
                } else {
                    fetch('/api/machines/' + this.itemToEdit, {
                        method: "PUT",
                        body: JSON.stringify(this.machine),
                        headers: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        this.form = false;
                        this.edit = false
                        this.getMachines();
                    });
                }
                this.machine = new Machine();
            },
            deleteMachine(id) {
                fetch('/api/machines/' + id, {
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    this.getMachines();
                });
            }
        }
    }
</script>
