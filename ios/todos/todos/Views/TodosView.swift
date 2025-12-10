import SwiftUI

struct TodosView: View {
    @StateObject private var vm = TodosViewModel()

    let isOn = false

    var body: some View {
        NavigationView {
            List(vm.todos) { todo in
                Text(todo.text)
            }
            .refreshable { await vm.load() }
            .overlay {
                if vm.isLoading {
                    ProgressView()
                }
            }
            .task {
                await vm.load()
            }
            .alert("Error", isPresented: .constant(vm.error != nil)) {
                Button("OK") { vm.error = nil }
            } message: {
                Text(vm.error ?? "")
            }
            .navigationTitle("Todos")
        }
    }
}

#Preview {

    TodosView()
}
