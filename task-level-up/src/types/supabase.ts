export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          level: number
          experience: number
          last_task_reset: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          level?: number
          experience?: number
          last_task_reset?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          level?: number
          experience?: number
          last_task_reset?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          completed: boolean
          experience_points: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          completed?: boolean
          experience_points: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          completed?: boolean
          experience_points?: number
          created_at?: string
        }
      }
    }
  }
}
